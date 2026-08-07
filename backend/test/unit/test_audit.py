from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from models.account import UserRole
from models.audit import (
    AuditKind,
    AuditScale,
    AuditTimeline,
    OrderAuditDetails,
    OrderAuditOpoItem,
)
from models.order import OrderWorkType
from schemas.audit import (
    AuditCustomerProfileInput,
    AuditExpertProfileInput,
    AuditLicenseHolderProfileInput,
    AuditOrderDetailsInput,
)
from services.audit import (
    AuditValidator,
    DeleteAuditDocumentUseCase,
    GetAuditCustomerProfileUseCase,
    GetAuditExpertProfileUseCase,
    GetAuditLicenseHolderProfileUseCase,
    SaveAuditCustomerProfileUseCase,
    SaveAuditExpertProfileUseCase,
    SaveAuditLicenseHolderProfileUseCase,
    UploadAuditDocumentUseCase,
)
from services.directions.registry import get_direction
from services.orders.direction_details import apply_details, build_details


def build_expert_account(profile: object = None) -> SimpleNamespace:
    """Аккаунт исполнителя; анкета аудитора опциональна."""
    return SimpleNamespace(
        id=1,
        public_id="expert-public",
        role=UserRole.EXPERT,
        expert_profile=SimpleNamespace(id=5, audit_profile=profile),
        customer_profile=None,
        license_holder_profile=None,
    )


def build_customer_account(profile: object = None) -> SimpleNamespace:
    return SimpleNamespace(
        id=2,
        public_id="customer-public",
        role=UserRole.CUSTOMER,
        expert_profile=None,
        customer_profile=SimpleNamespace(id=7, audit_profile=profile),
        license_holder_profile=None,
    )


def build_license_holder_account(profile: object = None) -> SimpleNamespace:
    return SimpleNamespace(
        id=3,
        public_id="holder-public",
        role=UserRole.LICENSE_HOLDER,
        expert_profile=None,
        customer_profile=None,
        license_holder_profile=SimpleNamespace(id=9, audit_profile=profile),
    )


def build_repo(account: SimpleNamespace | None) -> MagicMock:
    repo = MagicMock()
    repo.find_account = AsyncMock(return_value=account)
    repo.add = AsyncMock()
    return repo


def opo_item(**overrides: object) -> dict[str, object]:
    item: dict[str, object] = {
        "registration_number": "А01-12345-0001",
        "name": "Сеть газопотребления",
        "hazard_class": "III",
        "address": "Казань, ул. Заводская, 1",
        "industry": "Газоснабжение",
        "hazard_signs": "Использование горючих веществ",
    }
    item.update(overrides)
    return item


def order_payload(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "applicant_full_name": "Иванов Иван Иванович",
        "applicant_position": "Главный инженер",
        "applicant_organization": "ООО Ромашка",
        "applicant_inn": "7707083893",
        "applicant_phone": "+7-999-000-00-00",
        "applicant_email": "customer@example.com",
        "audit_scale": AuditScale.SINGLE_OPO,
        "opo_items": [opo_item()],
        "audit_kind": AuditKind.CONSULTATION,
        "desired_timeline": AuditTimeline.CONSULTATION,
    }
    payload.update(overrides)
    return payload


class TestExpertProfileSchema:
    def test_auditor_accepts_catalog_codes(self):
        payload = AuditExpertProfileInput(
            industrial_safety_areas=["А.1", "Б.1"],
            expert_attestation_areas=["Э1 КЛ/ТП"],
            audit_qualifications=["40.20900.185"],
        )
        assert payload.audit_qualifications == ["40.20900.185"]

    def test_unknown_code_rejected(self):
        with pytest.raises(ValidationError):
            AuditExpertProfileInput(industrial_safety_areas=["Я.9"])

    def test_duplicate_codes_collapsed(self):
        payload = AuditExpertProfileInput(industrial_safety_areas=["А.1", "А.1", "Б.2"])
        assert payload.industrial_safety_areas == ["А.1", "Б.2"]


class TestLicenseHolderProfileSchema:
    def test_certificate_number_required(self):
        with pytest.raises(ValidationError):
            AuditLicenseHolderProfileInput(certificate_number="")

    def test_unknown_accreditation_code_rejected(self):
        with pytest.raises(ValidationError):
            AuditLicenseHolderProfileInput(
                certificate_number="RA.RU.010001", accreditation_areas=["13.2.99"]
            )

    def test_full_form_accepted(self):
        payload = AuditLicenseHolderProfileInput(
            certificate_number="RA.RU.010001",
            accreditation_areas=["13.2.1", "13.2.19"],
        )
        assert payload.accreditation_areas == ["13.2.1", "13.2.19"]


class TestOrderSchemaScaleBranch:
    def test_single_opo_requires_exactly_one_item(self):
        with pytest.raises(ValidationError):
            AuditOrderDetailsInput(**order_payload(opo_items=[]))
        with pytest.raises(ValidationError):
            AuditOrderDetailsInput(**order_payload(opo_items=[opo_item(), opo_item()]))

    def test_selected_opo_requires_items(self):
        with pytest.raises(ValidationError):
            AuditOrderDetailsInput(
                **order_payload(audit_scale=AuditScale.SELECTED_OPO, opo_items=[])
            )

    def test_all_opo_requires_total(self):
        with pytest.raises(ValidationError):
            AuditOrderDetailsInput(
                **order_payload(audit_scale=AuditScale.ALL_OPO, opo_items=[])
            )

    def test_all_opo_class_sum_must_fit_total(self):
        with pytest.raises(ValidationError):
            AuditOrderDetailsInput(
                **order_payload(
                    audit_scale=AuditScale.ALL_OPO,
                    opo_items=[],
                    opo_total=3,
                    opo_class_1=2,
                    opo_class_2=2,
                )
            )

    def test_all_opo_full_form_accepted(self):
        payload = AuditOrderDetailsInput(
            **order_payload(
                audit_scale=AuditScale.ALL_OPO,
                opo_items=[],
                opo_total=5,
                opo_class_2=2,
                opo_class_3=3,
                main_industry="Металлургия",
                multiple_regions=True,
                registration_certificate={"name": "свидетельство.pdf", "url": "/u/cert"},
            )
        )
        assert payload.opo_total == 5


class TestOrderSchemaKindBranch:
    def test_basic_requires_sto_answer(self):
        with pytest.raises(ValidationError):
            AuditOrderDetailsInput(**order_payload(audit_kind=AuditKind.BASIC))

    def test_sto_yes_requires_name_and_file(self):
        with pytest.raises(ValidationError):
            AuditOrderDetailsInput(
                **order_payload(audit_kind=AuditKind.BASIC, considers_sto=True)
            )

    def test_basic_with_sto_accepted(self):
        payload = AuditOrderDetailsInput(
            **order_payload(
                audit_kind=AuditKind.BASIC,
                considers_sto=True,
                sto_name="СТО 01-2024 «Положение о СУПБ»",
                sto_file={"name": "сто.pdf", "url": "/u/sto"},
            )
        )
        assert payload.considers_sto is True

    def test_interim_without_sto_accepted(self):
        payload = AuditOrderDetailsInput(
            **order_payload(audit_kind=AuditKind.INTERIM, considers_sto=False)
        )
        assert payload.sto_file is None

    def test_selective_requires_areas(self):
        with pytest.raises(ValidationError):
            AuditOrderDetailsInput(**order_payload(audit_kind=AuditKind.SELECTIVE))

    def test_selective_with_p17_codes_accepted(self):
        payload = AuditOrderDetailsInput(
            **order_payload(audit_kind=AuditKind.SELECTIVE, audit_areas=["p17_01", "p17_18"])
        )
        assert payload.audit_areas == ["p17_01", "p17_18"]

    def test_unknown_p17_code_rejected(self):
        with pytest.raises(ValidationError):
            AuditOrderDetailsInput(
                **order_payload(audit_kind=AuditKind.SELECTIVE, audit_areas=["p17_99"])
            )


class TestProfileUseCases:
    @pytest.mark.asyncio
    async def test_empty_expert_profile_returns_defaults(self):
        repo = build_repo(build_expert_account())
        profile = await GetAuditExpertProfileUseCase(AuditValidator(repo)).execute(1)

        assert profile.industrial_safety_areas == []
        assert profile.documents == []

    @pytest.mark.asyncio
    async def test_save_creates_expert_profile(self):
        account = build_expert_account()
        repo = build_repo(account)
        use_case = SaveAuditExpertProfileUseCase(repo, AuditValidator(repo))

        result = await use_case.execute(
            1, AuditExpertProfileInput(audit_qualifications=["40.20900.185"])
        )

        assert result.audit_qualifications == ["40.20900.185"]
        assert account.expert_profile.audit_profile is not None
        repo.add.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_customer_cannot_open_expert_profile(self):
        repo = build_repo(build_customer_account())
        with pytest.raises(HTTPException) as error:
            await GetAuditExpertProfileUseCase(AuditValidator(repo)).execute(2)
        assert error.value.status_code == 403

    @pytest.mark.asyncio
    async def test_expert_cannot_open_customer_profile(self):
        repo = build_repo(build_expert_account())
        with pytest.raises(HTTPException) as error:
            await GetAuditCustomerProfileUseCase(AuditValidator(repo)).execute(1)
        assert error.value.status_code == 403

    @pytest.mark.asyncio
    async def test_save_creates_customer_profile(self):
        account = build_customer_account()
        repo = build_repo(account)
        use_case = SaveAuditCustomerProfileUseCase(repo, AuditValidator(repo))

        result = await use_case.execute(
            2, AuditCustomerProfileInput(position="Главный инженер", opo_license_number="ВХ-00-000")
        )

        assert result.position == "Главный инженер"
        assert account.customer_profile.audit_profile is not None

    @pytest.mark.asyncio
    async def test_empty_license_holder_profile_returns_defaults(self):
        repo = build_repo(build_license_holder_account())
        profile = await GetAuditLicenseHolderProfileUseCase(AuditValidator(repo)).execute(3)

        assert profile.certificate_number == ""
        assert profile.accreditation_areas == []

    @pytest.mark.asyncio
    async def test_save_creates_license_holder_profile(self):
        account = build_license_holder_account()
        repo = build_repo(account)
        use_case = SaveAuditLicenseHolderProfileUseCase(repo, AuditValidator(repo))

        result = await use_case.execute(
            3,
            AuditLicenseHolderProfileInput(
                certificate_number="RA.RU.010001", accreditation_areas=["13.2.1"]
            ),
        )

        assert result.certificate_number == "RA.RU.010001"
        assert account.license_holder_profile.audit_profile is not None

    @pytest.mark.asyncio
    async def test_expert_cannot_open_license_holder_profile(self):
        repo = build_repo(build_expert_account())
        with pytest.raises(HTTPException) as error:
            await GetAuditLicenseHolderProfileUseCase(AuditValidator(repo)).execute(1)
        assert error.value.status_code == 403

    @pytest.mark.asyncio
    async def test_document_limit_enforced(self):
        documents = [{"name": f"{i}.pdf", "url": f"/u/{i}"} for i in range(10)]
        account = build_expert_account(SimpleNamespace(documents=documents))
        repo = build_repo(account)
        use_case = UploadAuditDocumentUseCase(repo, AuditValidator(repo))

        with pytest.raises(HTTPException) as error:
            await use_case.execute(1, MagicMock())
        assert error.value.status_code == 400

    @pytest.mark.asyncio
    async def test_delete_unknown_document_gives_404(self):
        account = build_expert_account(SimpleNamespace(documents=[]))
        repo = build_repo(account)
        use_case = DeleteAuditDocumentUseCase(repo, AuditValidator(repo))

        with pytest.raises(HTTPException) as error:
            await use_case.execute(1, "/uploads/direction-documents/expert-public/x.pdf")
        assert error.value.status_code == 404


class TestOrderDetailsBuild:
    """Заявка аудита — единственная с дочерними строками: ОПО строятся сущностями."""

    def direction(self):
        return get_direction(OrderWorkType.AUDIT_SUPB.value)

    def test_build_creates_details_with_opo_entities(self):
        validated = AuditOrderDetailsInput(
            **order_payload(
                audit_scale=AuditScale.SELECTED_OPO,
                opo_items=[opo_item(), opo_item(name="Котельная")],
            )
        )

        details = build_details(self.direction(), validated)

        assert isinstance(details, OrderAuditDetails)
        assert [type(item) for item in details.opo_items] == [OrderAuditOpoItem, OrderAuditOpoItem]
        assert [item.position for item in details.opo_items] == [0, 1]
        assert details.opo_items[1].name == "Котельная"

    def test_build_stores_files_as_json(self):
        validated = AuditOrderDetailsInput(
            **order_payload(
                audit_kind=AuditKind.BASIC,
                considers_sto=True,
                sto_name="СТО 01-2024",
                sto_file={"name": "сто.pdf", "url": "/u/sto"},
            )
        )

        details = build_details(self.direction(), validated)

        assert details.sto_file == {"name": "сто.pdf", "url": "/u/sto"}

    def test_apply_replaces_opo_items(self):
        current = build_details(self.direction(), AuditOrderDetailsInput(**order_payload()))
        validated = AuditOrderDetailsInput(
            **order_payload(
                audit_scale=AuditScale.SELECTED_OPO,
                opo_items=[opo_item(name="Новый объект")],
                comments="Уточнили объект",
            )
        )

        apply_details(current, validated)

        assert current.audit_scale is AuditScale.SELECTED_OPO
        assert [item.name for item in current.opo_items] == ["Новый объект"]
        assert current.comments == "Уточнили объект"
