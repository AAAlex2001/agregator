from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from models.account import UserRole
from models.direction_profile import AuditParticipantKind
from models.order import OrderWorkType
from schemas.directions import (
    AuditProfileInput,
    CustomerAuditProfileInput,
    LaboratoryOrderDetailsInput,
    ResearchOrderDetailsInput,
)
from schemas.registration import DirectionRegistration
from services.directions.registry import DIRECTIONS, directions_for_role, get_direction
from services.directions.use_cases.get_direction_profile import GetDirectionProfileUseCase
from services.directions.use_cases.list_expert_directions import ListRoleDirectionsUseCase
from services.directions.use_cases.upsert_direction_profile import UpsertDirectionProfileUseCase
from services.directions.validators import DirectionsValidator
from services.registration.direction_forms import build_profiles

AUDIT = OrderWorkType.AUDIT_SUPB.value
EXPERTISE = OrderWorkType.EXPERTISE.value


def build_expert_account(audit: object = None, **expert_fields: object) -> SimpleNamespace:
    "Аккаунт исполнителя с профилем роли и (опционально) анкетой аудита."
    expert = SimpleNamespace(
        id=5,
        audit_profile=audit,
        cadastral_profile=None,
        forensic_profile=None,
        certificates=[],
        show_on_map=True,
        map_fields=[],
        **expert_fields,
    )
    return SimpleNamespace(
        id=1,
        role=UserRole.EXPERT,
        customer_profile=None,
        expert_profile=expert,
        license_holder_profile=None,
    )


def build_customer_account(audit: object = None) -> SimpleNamespace:
    customer = SimpleNamespace(id=7, audit_profile=audit)
    return SimpleNamespace(
        id=2,
        role=UserRole.CUSTOMER,
        customer_profile=customer,
        expert_profile=None,
        license_holder_profile=None,
    )


def build_validator(account: SimpleNamespace | None) -> DirectionsValidator:
    repo = MagicMock()
    repo.find_account = AsyncMock(return_value=account)
    repo.add = AsyncMock()
    return DirectionsValidator(repo)


class TestRegistry:
    "Реестр — единственный источник знания о направлениях и их анкетах."

    def test_keys_are_unique(self):
        keys = [direction.key for direction in DIRECTIONS]
        assert len(keys) == len(set(keys))

    def test_get_direction_unknown_returns_none(self):
        assert get_direction("UNKNOWN") is None

    def test_expertise_available_to_expert_and_license_holder(self):
        expertise = get_direction(EXPERTISE)
        assert set(expertise.roles) == {UserRole.EXPERT, UserRole.LICENSE_HOLDER}

    def test_audit_available_to_customer_and_expert(self):
        audit = get_direction(AUDIT)
        assert set(audit.roles) == {UserRole.CUSTOMER, UserRole.EXPERT}

    def test_expertise_fields_live_in_role_profile(self):
        "У ЭПБ анкета хранится полями профиля роли, а не отдельной таблицей."
        form = get_direction(EXPERTISE).form_for(UserRole.EXPERT)
        assert form.is_separate_table is False

    def test_audit_fields_live_in_separate_table(self):
        form = get_direction(AUDIT).form_for(UserRole.EXPERT)
        assert form.is_separate_table is True
        assert form.owner_attribute == "audit_profile"

    def test_customer_sees_only_audit(self):
        keys = {direction.key for direction in directions_for_role(UserRole.CUSTOMER)}
        assert keys == {AUDIT}

    def test_license_holder_sees_only_expertise(self):
        keys = {direction.key for direction in directions_for_role(UserRole.LICENSE_HOLDER)}
        assert keys == {EXPERTISE}

    def test_details_attributes_are_unique(self):
        attributes = [d.details_attribute for d in DIRECTIONS if d.has_details]
        assert len(attributes) == len(set(attributes))


class TestValidators:
    def test_unknown_direction_raises_404(self):
        with pytest.raises(HTTPException) as error:
            build_validator(build_expert_account()).require_direction("UNKNOWN")
        assert error.value.status_code == 404

    def test_direction_of_other_role_raises_403(self):
        "Кадастровые работы недоступны заказчику."
        validator = build_validator(build_customer_account())
        cadastral = get_direction(OrderWorkType.CADASTRAL.value)
        with pytest.raises(HTTPException) as error:
            validator.require_form(build_customer_account(), cadastral)
        assert error.value.status_code == 403

    @pytest.mark.asyncio
    async def test_missing_account_raises_404(self):
        with pytest.raises(HTTPException) as error:
            await build_validator(None).require_account(1)
        assert error.value.status_code == 404


class TestListRoleDirections:
    @pytest.mark.asyncio
    async def test_expert_sees_own_directions_with_filled_flags(self):
        account = build_expert_account(audit=SimpleNamespace())
        result = await ListRoleDirectionsUseCase(build_validator(account)).execute(1)

        by_key = {item.key: item.profile_filled for item in result}
        assert by_key[AUDIT] is True
        assert by_key[OrderWorkType.CADASTRAL.value] is False
        assert by_key[EXPERTISE] is True

    @pytest.mark.asyncio
    async def test_customer_sees_only_audit(self):
        account = build_customer_account()
        result = await ListRoleDirectionsUseCase(build_validator(account)).execute(2)

        assert [item.key for item in result] == [AUDIT]
        assert result[0].profile_filled is False


class TestGetDirectionProfile:
    @pytest.mark.asyncio
    async def test_empty_audit_profile_returns_defaults(self):
        use_case = GetDirectionProfileUseCase(build_validator(build_expert_account()))
        profile = await use_case.execute(1, AUDIT)

        assert profile.participant_kind is AuditParticipantKind.AUDITOR
        assert profile.industrial_safety_areas == []

    @pytest.mark.asyncio
    async def test_expertise_profile_read_from_role_profile(self):
        account = build_expert_account()
        account.expert_profile.certificates = [{"area": "Э1", "object": "ТУ", "category": "3"}]
        use_case = GetDirectionProfileUseCase(build_validator(account))

        profile = await use_case.execute(1, EXPERTISE)

        assert len(profile.certificates) == 1
        assert profile.certificates[0].area == "Э1"


class TestUpsertDirectionProfile:
    @pytest.mark.asyncio
    async def test_creates_audit_profile_for_expert(self):
        account = build_expert_account()
        repo = MagicMock()
        repo.find_account = AsyncMock(return_value=account)
        repo.add = AsyncMock()
        use_case = UpsertDirectionProfileUseCase(repo, DirectionsValidator(repo))

        await use_case.execute(
            1, AUDIT, {"participant_kind": "AUDITOR", "audit_qualifications": ["40.20900.185"]}
        )

        created = repo.add.await_args.args[0]
        assert created.audit_qualifications == ["40.20900.185"]
        assert account.expert_profile.audit_profile is created

    @pytest.mark.asyncio
    async def test_writes_expertise_into_role_profile(self):
        "У ЭПБ анкета пишется прямо в профиль исполнителя."
        account = build_expert_account()
        repo = MagicMock()
        repo.find_account = AsyncMock(return_value=account)
        repo.add = AsyncMock()
        use_case = UpsertDirectionProfileUseCase(repo, DirectionsValidator(repo))

        await use_case.execute(1, EXPERTISE, {"show_on_map": False, "map_fields": ["name"]})

        assert account.expert_profile.show_on_map is False
        assert account.expert_profile.map_fields == ["name"]

    @pytest.mark.asyncio
    async def test_invalid_payload_raises_422(self):
        account = build_expert_account()
        repo = MagicMock()
        repo.find_account = AsyncMock(return_value=account)
        repo.add = AsyncMock()
        use_case = UpsertDirectionProfileUseCase(repo, DirectionsValidator(repo))

        with pytest.raises(HTTPException) as error:
            await use_case.execute(1, AUDIT, {"audit_qualifications": ["40.20900.999"]})
        assert error.value.status_code == 422


class TestRegistrationDirectionForms:
    "Направления, выбранные при регистрации, заполняются тем же реестром."

    def test_separate_table_profile_created_for_customer(self):
        account = build_customer_account()
        created = build_profiles(
            account, [DirectionRegistration(key=AUDIT, data={"position": "Главный инженер"})]
        )

        assert len(created) == 1
        assert created[0].position == "Главный инженер"
        assert account.customer_profile.audit_profile is created[0]

    def test_expertise_written_into_role_profile(self):
        account = build_expert_account()
        created = build_profiles(
            account,
            [DirectionRegistration(key=EXPERTISE, data={"show_on_map": False, "map_fields": ["name"]})],
        )

        assert created == []
        assert account.expert_profile.show_on_map is False
        assert account.expert_profile.map_fields == ["name"]

    def test_unknown_direction_raises_400(self):
        with pytest.raises(HTTPException) as error:
            build_profiles(build_expert_account(), [DirectionRegistration(key="UNKNOWN", data={})])
        assert error.value.status_code == 400

    def test_direction_of_other_role_raises_400(self):
        "Заказчик не может заполнить анкету кадастрового инженера."
        with pytest.raises(HTTPException) as error:
            build_profiles(
                build_customer_account(),
                [DirectionRegistration(key=OrderWorkType.CADASTRAL.value, data={})],
            )
        assert error.value.status_code == 400

    def test_invalid_fields_raise_400(self):
        with pytest.raises(HTTPException) as error:
            build_profiles(
                build_expert_account(),
                [DirectionRegistration(key=AUDIT, data={"audit_qualifications": ["40.20900.999"]})],
            )
        assert error.value.status_code == 400


class TestAuditProfileSchemas:
    def test_auditor_accepts_catalog_codes(self):
        payload = AuditProfileInput(
            industrial_safety_areas=["А.1", "Б.1"],
            expert_attestation_areas=["Э1 КЛ/ТП"],
            audit_qualifications=["40.20900.185"],
        )
        assert payload.participant_kind is AuditParticipantKind.AUDITOR

    def test_unknown_code_rejected(self):
        with pytest.raises(ValidationError):
            AuditProfileInput(accreditation_areas=["13.2.99"])

    def test_duplicate_codes_collapsed(self):
        payload = AuditProfileInput(industrial_safety_areas=["А.1", "А.1", "Б.2"])
        assert payload.industrial_safety_areas == ["А.1", "Б.2"]

    def test_inspection_body_requires_name_and_certificate(self):
        with pytest.raises(ValidationError):
            AuditProfileInput(participant_kind=AuditParticipantKind.INSPECTION_BODY)

    def test_customer_audit_profile(self):
        payload = CustomerAuditProfileInput(position="Главный инженер", opo_license_number="ВХ-00-000")
        assert payload.position == "Главный инженер"


class TestOrderDetailsSchemas:
    def test_research_drops_blank_requirements(self):
        payload = ResearchOrderDetailsInput(
            executor_requirements=["Кандидат наук", "  ", ""], needs_site_visit=True
        )
        assert payload.executor_requirements == ["Кандидат наук"]

    def test_laboratory_equipment_requirements(self):
        payload = LaboratoryOrderDetailsInput(equipment_requirements="УЗК-дефектоскоп")
        assert payload.equipment_requirements == "УЗК-дефектоскоп"
