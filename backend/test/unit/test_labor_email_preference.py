from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from models.user import UserRole
from services.settings.use_cases.update_email_preferences import (
    UpdateEmailPreferencesUseCase,
)


@pytest.mark.asyncio
async def test_license_holder_cannot_disable_labor_email() -> None:
    user = SimpleNamespace(
        role=UserRole.LICENSE_HOLDER,
        email_on_labor_listing=True,
    )
    repo = MagicMock()
    repo.flush = AsyncMock()
    validator = MagicMock()
    validator.require_user = AsyncMock(return_value=user)
    use_case = UpdateEmailPreferencesUseCase(repo, validator)

    updated = await use_case.execute(
        user_id=1,
        patch={"email_on_labor_listing": False},
    )

    assert updated.email_on_labor_listing is True
    repo.flush.assert_awaited_once()


@pytest.mark.asyncio
async def test_expert_can_disable_labor_email() -> None:
    user = SimpleNamespace(
        role=UserRole.EXPERT,
        email_on_labor_listing=True,
    )
    repo = MagicMock()
    repo.flush = AsyncMock()
    validator = MagicMock()
    validator.require_user = AsyncMock(return_value=user)
    use_case = UpdateEmailPreferencesUseCase(repo, validator)

    updated = await use_case.execute(
        user_id=1,
        patch={"email_on_labor_listing": False},
    )

    assert updated.email_on_labor_listing is False
    repo.flush.assert_awaited_once()
