from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from models.account import UserRole
from services.settings.use_cases.update_email_preferences import (
    UpdateEmailPreferencesUseCase,
)


def build_use_case(account: SimpleNamespace) -> UpdateEmailPreferencesUseCase:
    repo = MagicMock()
    repo.flush = AsyncMock()
    validator = MagicMock()
    validator.require_user = AsyncMock(return_value=account)
    return UpdateEmailPreferencesUseCase(repo, validator)


@pytest.mark.asyncio
async def test_license_holder_cannot_disable_labor_email() -> None:
    account = SimpleNamespace(
        role=UserRole.LICENSE_HOLDER,
        customer_profile=None,
        expert_profile=None,
        license_holder_profile=SimpleNamespace(email_on_labor_listing=True),
    )

    await build_use_case(account).execute(
        user_id=1,
        patch={"email_on_labor_listing": False},
    )

    assert account.license_holder_profile.email_on_labor_listing is True


@pytest.mark.asyncio
async def test_expert_can_disable_labor_email() -> None:
    account = SimpleNamespace(
        role=UserRole.EXPERT,
        customer_profile=None,
        expert_profile=SimpleNamespace(email_on_labor_listing=True),
        license_holder_profile=None,
    )

    await build_use_case(account).execute(
        user_id=1,
        patch={"email_on_labor_listing": False},
    )

    assert account.expert_profile.email_on_labor_listing is False


@pytest.mark.asyncio
async def test_foreign_role_field_silently_skipped() -> None:
    "Поле чужой роли не падает и ничего не меняет: у заказчика нет email_on_order_updated."
    account = SimpleNamespace(
        role=UserRole.CUSTOMER,
        customer_profile=SimpleNamespace(email_on_response_created=True),
        expert_profile=None,
        license_holder_profile=None,
    )

    await build_use_case(account).execute(
        user_id=1,
        patch={"email_on_order_updated": False, "email_on_response_created": False},
    )

    assert account.customer_profile.email_on_response_created is False
