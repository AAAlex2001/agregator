from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from models.account import UserRole
from schemas.cadastral import CadastralOrderDetailsInput, CadastralProfileInput
from services.cadastral import (
    CadastralValidator,
    DeleteCadastralDocumentUseCase,
    GetCadastralProfileUseCase,
    SaveCadastralProfileUseCase,
    UploadCadastralDocumentUseCase,
)


def build_expert_account(profile: object = None) -> SimpleNamespace:
    """Аккаунт исполнителя; анкета кадастрового инженера опциональна."""
    return SimpleNamespace(
        id=1,
        public_id="expert-public",
        role=UserRole.EXPERT,
        expert_profile=SimpleNamespace(id=5, cadastral_profile=profile),
        customer_profile=None,
        license_holder_profile=None,
    )


def build_customer_account() -> SimpleNamespace:
    return SimpleNamespace(
        id=2,
        public_id="customer-public",
        role=UserRole.CUSTOMER,
        expert_profile=None,
        customer_profile=SimpleNamespace(id=7),
        license_holder_profile=None,
    )


def build_repo(account: SimpleNamespace | None) -> MagicMock:
    repo = MagicMock()
    repo.find_account = AsyncMock(return_value=account)
    repo.add = AsyncMock()
    return repo


def order_payload(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "applicant_full_name": "Иванов Иван Иванович",
        "applicant_position": "Главный инженер",
        "applicant_organization": "ООО Ромашка",
        "applicant_inn": "7707083893",
        "applicant_phone": "+7-999-000-00-00",
        "applicant_email": "customer@example.com",
        "work_purpose": "Межевание участка",
        "city": "Казань",
        "education_requirement": "Высшее профильное",
        "sro_required": True,
        "duration": "30 дней",
    }
    payload.update(overrides)
    return payload


class TestCadastralProfileSchema:
    def test_defaults_are_empty(self):
        payload = CadastralProfileInput()

        assert payload.education == ""
        assert payload.has_equipment is False
        assert payload.registry_joined_at is None

    def test_filled_profile_accepted(self):
        payload = CadastralProfileInput(
            education="МИИГАиК",
            registry_joined_at="2020-05-01",
            certificate_number="12-34-5678",
            registry_number="0001",
            has_equipment=True,
            city="Казань",
            workplace="ООО Гео",
        )

        assert payload.has_equipment is True
        assert payload.city == "Казань"


class TestCadastralOrderSchema:
    def test_full_form_accepted(self):
        payload = CadastralOrderDetailsInput(**order_payload())

        assert payload.sro_required is True
        assert payload.duration == "30 дней"

    def test_inn_must_be_ten_or_twelve_digits(self):
        with pytest.raises(ValidationError):
            CadastralOrderDetailsInput(**order_payload(applicant_inn="123"))

    def test_work_purpose_required(self):
        with pytest.raises(ValidationError):
            CadastralOrderDetailsInput(**order_payload(work_purpose=""))

    def test_city_required(self):
        with pytest.raises(ValidationError):
            CadastralOrderDetailsInput(**order_payload(city=""))


class TestCadastralProfileUseCases:
    @pytest.mark.asyncio
    async def test_empty_profile_returns_defaults(self):
        repo = build_repo(build_expert_account())
        use_case = GetCadastralProfileUseCase(CadastralValidator(repo))

        profile = await use_case.execute(1)

        assert profile.education == ""
        assert profile.documents == []
        assert profile.education_diploma is None

    @pytest.mark.asyncio
    async def test_save_creates_profile(self):
        account = build_expert_account()
        repo = build_repo(account)
        use_case = SaveCadastralProfileUseCase(repo, CadastralValidator(repo))

        result = await use_case.execute(
            1, CadastralProfileInput(education="МГУ", city="Казань", has_equipment=True)
        )

        assert result.education == "МГУ"
        assert result.has_equipment is True
        assert account.expert_profile.cadastral_profile is not None
        repo.add.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_customer_gets_403(self):
        repo = build_repo(build_customer_account())
        use_case = GetCadastralProfileUseCase(CadastralValidator(repo))

        with pytest.raises(HTTPException) as error:
            await use_case.execute(2)

        assert error.value.status_code == 403

    @pytest.mark.asyncio
    async def test_document_limit_enforced(self):
        documents = [{"name": f"{i}.pdf", "url": f"/u/{i}"} for i in range(10)]
        account = build_expert_account(SimpleNamespace(documents=documents))
        repo = build_repo(account)
        use_case = UploadCadastralDocumentUseCase(repo, CadastralValidator(repo))

        with pytest.raises(HTTPException) as error:
            await use_case.execute(1, MagicMock())

        assert error.value.status_code == 400

    @pytest.mark.asyncio
    async def test_delete_unknown_document_gives_404(self):
        account = build_expert_account(SimpleNamespace(documents=[]))
        repo = build_repo(account)
        use_case = DeleteCadastralDocumentUseCase(repo, CadastralValidator(repo))

        with pytest.raises(HTTPException) as error:
            await use_case.execute(1, "/uploads/direction-documents/expert-public/x.pdf")

        assert error.value.status_code == 404
