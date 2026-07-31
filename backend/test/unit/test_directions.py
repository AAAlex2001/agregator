from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException

from models.order import OrderWorkType
from schemas.directions import (
    CadastralProfileInput,
    ForensicProfileInput,
    LaboratoryOrderDetailsInput,
    ResearchOrderDetailsInput,
)
from services.directions.registry import DIRECTIONS, PROFILE_DIRECTIONS, get_direction
from services.directions.use_cases.get_direction_profile import GetDirectionProfileUseCase
from services.directions.use_cases.list_expert_directions import ListExpertDirectionsUseCase
from services.directions.use_cases.upsert_direction_profile import UpsertDirectionProfileUseCase
from services.directions.validators import DirectionsValidator


def build_expert(cadastral: object = None, forensic: object = None) -> SimpleNamespace:
    return SimpleNamespace(id=5, cadastral_profile=cadastral, forensic_profile=forensic)


def build_validator(expert: SimpleNamespace | None) -> DirectionsValidator:
    repo = MagicMock()
    repo.find_expert_by_account = AsyncMock(return_value=expert)
    return DirectionsValidator(repo)


class TestRegistry:
    def test_contains_all_directions(self):
        keys = {direction.key for direction in DIRECTIONS}
        assert keys == {
            OrderWorkType.CADASTRAL.value,
            OrderWorkType.FORENSIC.value,
            OrderWorkType.RESEARCH.value,
            OrderWorkType.LABORATORY.value,
        }

    def test_keys_are_unique(self):
        keys = [direction.key for direction in DIRECTIONS]
        assert len(keys) == len(set(keys))

    def test_get_direction_unknown_returns_none(self):
        assert get_direction("UNKNOWN") is None

    def test_only_cadastral_and_forensic_have_profile(self):
        "У НИР и лабораторных анкеты нет — квалификация подтверждается сертификатами эксперта."
        with_profile = {direction.key for direction in PROFILE_DIRECTIONS}
        assert with_profile == {OrderWorkType.CADASTRAL.value, OrderWorkType.FORENSIC.value}

    def test_profile_attributes_point_to_expert_relationships(self):
        attributes = {direction.profile_attribute for direction in PROFILE_DIRECTIONS}
        assert attributes == {"cadastral_profile", "forensic_profile"}

    def test_details_attributes_are_unique(self):
        attributes = [direction.details_attribute for direction in DIRECTIONS]
        assert len(attributes) == len(set(attributes))


class TestOrderDetailsSchemas:
    def test_research_drops_blank_requirements(self):
        "Пустые поля динамического списка «добавить поле» не сохраняются."
        payload = ResearchOrderDetailsInput(
            executor_requirements=["Кандидат наук", "  ", "", "Стаж от 5 лет"],
            needs_site_visit=True,
        )
        assert payload.executor_requirements == ["Кандидат наук", "Стаж от 5 лет"]
        assert payload.needs_site_visit is True

    def test_research_defaults_are_empty(self):
        payload = ResearchOrderDetailsInput()
        assert payload.executor_requirements == []
        assert payload.needs_site_visit is False

    def test_laboratory_equipment_requirements(self):
        payload = LaboratoryOrderDetailsInput(equipment_requirements="УЗК-дефектоскоп")
        assert payload.equipment_requirements == "УЗК-дефектоскоп"


class TestValidators:
    def test_unknown_direction_raises_404(self):
        validator = build_validator(build_expert())
        with pytest.raises(HTTPException) as error:
            validator.require_direction("UNKNOWN")
        assert error.value.status_code == 404

    @pytest.mark.asyncio
    async def test_missing_expert_raises_403(self):
        validator = build_validator(None)
        with pytest.raises(HTTPException) as error:
            await validator.require_expert(1)
        assert error.value.status_code == 403


class TestListExpertDirections:
    @pytest.mark.asyncio
    async def test_profile_filled_flags(self):
        expert = build_expert(cadastral=SimpleNamespace(), forensic=None)
        result = await ListExpertDirectionsUseCase(build_validator(expert)).execute(1)

        by_key = {summary.key: summary.profile_filled for summary in result}
        assert by_key[OrderWorkType.CADASTRAL.value] is True
        assert by_key[OrderWorkType.FORENSIC.value] is False


class TestGetDirectionProfile:
    @pytest.mark.asyncio
    async def test_empty_profile_returns_defaults(self):
        use_case = GetDirectionProfileUseCase(build_validator(build_expert()))
        profile = await use_case.execute(1, OrderWorkType.CADASTRAL.value)

        assert profile.education == ""
        assert profile.documents == []


class TestUpsertDirectionProfile:
    @pytest.mark.asyncio
    async def test_creates_profile_when_missing(self):
        expert = build_expert()
        repo = MagicMock()
        repo.find_expert_by_account = AsyncMock(return_value=expert)
        repo.add = AsyncMock()
        use_case = UpsertDirectionProfileUseCase(repo, DirectionsValidator(repo))

        payload = CadastralProfileInput(
            education="МИИГАиК",
            certificate_number="77-11-123",
            registry_number="1234",
        )
        result = await use_case.execute(1, OrderWorkType.CADASTRAL.value, payload)

        created = repo.add.await_args.args[0]
        assert created.expert_id == expert.id
        assert created.education == "МИИГАиК"
        assert result.certificate_number == "77-11-123"

    @pytest.mark.asyncio
    async def test_updates_existing_profile(self):
        existing = get_direction(OrderWorkType.FORENSIC.value).profile_model(
            expert_id=5, education="старое", workplace_name="ООО Бюро"
        )
        expert = build_expert(forensic=existing)
        repo = MagicMock()
        repo.find_expert_by_account = AsyncMock(return_value=expert)
        repo.add = AsyncMock()
        use_case = UpsertDirectionProfileUseCase(repo, DirectionsValidator(repo))

        payload = ForensicProfileInput(education="новое", similar_cases_experience="10 дел")
        result = await use_case.execute(1, OrderWorkType.FORENSIC.value, payload)

        assert repo.add.await_args.args[0] is existing
        assert existing.education == "новое"
        assert existing.similar_cases_experience == "10 дел"
        assert result.education == "новое"
