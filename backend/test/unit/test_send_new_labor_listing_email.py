from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from models.labor import (
    EmploymentTerm,
    LaborListingKind,
)
from models.user import UserRole
from services.email.use_cases.send_new_labor_listing_email import (
    SendNewLaborListingEmailUseCase,
)


def make_listing(kind: LaborListingKind) -> SimpleNamespace:
    return SimpleNamespace(
        id=1,
        kind=kind,
        region="Москва",
        employment_term=EmploymentTerm.PERMANENT,
        fixed_term=None,
        other_profession=None,
        certificates=[
            {
                "area": "Э12",
                "object": "ТУ",
                "category": "2",
            }
        ],
    )


@pytest.mark.asyncio
async def test_expert_search_is_sent_to_experts() -> None:
    listing = make_listing(LaborListingKind.EXPERT_WANTED)
    recipient = SimpleNamespace(first_name="Иван")
    repo = MagicMock()
    repo.find_labor_listing = AsyncMock(return_value=listing)
    repo.list_active_users_by_role = AsyncMock(
        return_value=[recipient]
    )
    dispatcher = MagicMock()

    use_case = SendNewLaborListingEmailUseCase(repo, dispatcher)
    await use_case.execute(listing.id)

    repo.list_active_users_by_role.assert_awaited_once_with(
        UserRole.EXPERT
    )
    assert dispatcher.notify.call_args[0][1] == (
        "email_on_labor_listing"
    )
    context = dispatcher.notify.call_args[0][4]
    assert context.cta_url.endswith("/labor/employment")
    assert context.certificates == ["Э12 · ТУ · 2 кат."]


@pytest.mark.asyncio
async def test_expert_listing_is_sent_to_license_holders() -> None:
    listing = make_listing(LaborListingKind.EXPERT_AVAILABLE)
    recipient = SimpleNamespace(first_name="Анна")
    repo = MagicMock()
    repo.find_labor_listing = AsyncMock(return_value=listing)
    repo.list_active_users_by_role = AsyncMock(
        return_value=[recipient]
    )
    dispatcher = MagicMock()

    use_case = SendNewLaborListingEmailUseCase(repo, dispatcher)
    await use_case.execute(listing.id)

    repo.list_active_users_by_role.assert_awaited_once_with(
        UserRole.LICENSE_HOLDER
    )
    context = dispatcher.notify.call_args[0][4]
    assert context.cta_url.endswith("/labor/expert-search")
