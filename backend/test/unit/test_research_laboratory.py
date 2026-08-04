from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException

from models.account import UserRole
from schemas.laboratory import LaboratoryProfileInput
from schemas.research import ResearchOrderDetailsInput, ResearchProfileInput
from services.laboratory import (
    GetLaboratoryProfileUseCase,
    LaboratoryValidator,
    SaveLaboratoryProfileUseCase,
)
from services.research import (
    GetResearchProfileUseCase,
    ResearchValidator,
    SaveResearchProfileUseCase,
)


def build_expert_account() -> SimpleNamespace:
    """Аккаунт исполнителя без анкет НИР и лаборатории."""
    return SimpleNamespace(
        id=1,
        public_id="expert-public",
        role=UserRole.EXPERT,
        expert_profile=SimpleNamespace(id=5, research_profile=None, laboratory_profile=None),
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


class TestResearchProfile:
    @pytest.mark.asyncio
    async def test_empty_profile_returns_defaults(self):
        repo = build_repo(build_expert_account())

        profile = await GetResearchProfileUseCase(ResearchValidator(repo)).execute(1)

        assert profile.academic_degree == ""
        assert profile.research_field == ""

    @pytest.mark.asyncio
    async def test_save_creates_profile(self):
        account = build_expert_account()
        repo = build_repo(account)
        use_case = SaveResearchProfileUseCase(repo, ResearchValidator(repo))

        result = await use_case.execute(
            1,
            ResearchProfileInput(
                academic_degree="к.т.н.",
                academic_title="доцент",
                research_field="Неразрушающий контроль",
            ),
        )

        assert result.academic_degree == "к.т.н."
        assert account.expert_profile.research_profile is not None
        repo.add.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_customer_gets_403(self):
        repo = build_repo(build_customer_account())

        with pytest.raises(HTTPException) as error:
            await GetResearchProfileUseCase(ResearchValidator(repo)).execute(2)

        assert error.value.status_code == 403


class TestLaboratoryProfile:
    @pytest.mark.asyncio
    async def test_empty_profile_returns_defaults(self):
        repo = build_repo(build_expert_account())

        profile = await GetLaboratoryProfileUseCase(LaboratoryValidator(repo)).execute(1)

        assert profile.accreditation_area == ""
        assert profile.comment == ""

    @pytest.mark.asyncio
    async def test_save_creates_profile(self):
        account = build_expert_account()
        repo = build_repo(account)
        use_case = SaveLaboratoryProfileUseCase(repo, LaboratoryValidator(repo))

        result = await use_case.execute(
            1,
            LaboratoryProfileInput(
                accreditation_area="Неразрушающий контроль сварных соединений",
                comment="Аккредитация до 2027 года",
            ),
        )

        assert result.accreditation_area == "Неразрушающий контроль сварных соединений"
        assert account.expert_profile.laboratory_profile is not None
        repo.add.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_customer_gets_403(self):
        repo = build_repo(build_customer_account())

        with pytest.raises(HTTPException) as error:
            await GetLaboratoryProfileUseCase(LaboratoryValidator(repo)).execute(2)

        assert error.value.status_code == 403


class TestResearchOrderSchema:
    def test_blank_requirements_dropped(self):
        payload = ResearchOrderDetailsInput(
            executor_requirements=["Кандидат наук", "  ", ""], needs_site_visit=True
        )

        assert payload.executor_requirements == ["Кандидат наук"]
        assert payload.needs_site_visit is True
