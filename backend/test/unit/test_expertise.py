from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException

from models.account import UserRole
from schemas.expertise import ExpertiseProfileInput
from services.expertise import (
    ExpertiseValidator,
    GetExpertiseProfileUseCase,
    SaveExpertiseProfileUseCase,
)

CERTIFICATE = {"area": "Э1", "object": "ТУ", "category": "3", "expires_at": None}


def build_expert_account() -> SimpleNamespace:
    return SimpleNamespace(
        id=1,
        role=UserRole.EXPERT,
        expert_profile=SimpleNamespace(id=5, certificates=[]),
        customer_profile=None,
        license_holder_profile=None,
    )


def build_customer_account() -> SimpleNamespace:
    return SimpleNamespace(
        id=2,
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


class TestExpertiseProfile:
    @pytest.mark.asyncio
    async def test_profile_read_from_role_profile(self):
        account = build_expert_account()
        account.expert_profile.certificates = [CERTIFICATE]
        repo = build_repo(account)

        profile = await GetExpertiseProfileUseCase(ExpertiseValidator(repo)).execute(1)

        assert len(profile.certificates) == 1
        assert profile.certificates[0].area == "Э1"

    @pytest.mark.asyncio
    async def test_save_writes_into_role_profile(self):
        "У ЭПБ анкета пишется прямо в профиль исполнителя, без отдельной таблицы."
        account = build_expert_account()
        repo = build_repo(account)
        use_case = SaveExpertiseProfileUseCase(repo, ExpertiseValidator(repo))

        await use_case.execute(1, ExpertiseProfileInput(certificates=[CERTIFICATE]))

        stored = account.expert_profile.certificates
        assert len(stored) == 1
        assert stored[0]["area"] == "Э1"
        assert stored[0]["object"] == "ТУ"
        repo.add.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_customer_gets_403(self):
        repo = build_repo(build_customer_account())
        with pytest.raises(HTTPException) as error:
            await GetExpertiseProfileUseCase(ExpertiseValidator(repo)).execute(2)
        assert error.value.status_code == 403

    @pytest.mark.asyncio
    async def test_missing_account_gives_404(self):
        repo = build_repo(None)
        with pytest.raises(HTTPException) as error:
            await GetExpertiseProfileUseCase(ExpertiseValidator(repo)).execute(1)
        assert error.value.status_code == 404
