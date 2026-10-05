"""Участие только новых исполнителей и безопасное продолжение регистрации."""

from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from models.account import Account, UserRole
from models.expert import Expert
from models.referral import Referral, ReferralStatus
from schemas.registration import UserRegistration
from schemas.research import ResearchProfileInput
from services.referrals import ReferralRepository, ReferralValidator, RegisterReferralUseCase


@pytest.fixture
def inviter() -> Account:
    return Account(
        id=1,
        public_id=str(uuid4()),
        role=UserRole.EXPERT,
        email="inviter@example.com",
        email_verified=True,
        is_active=True,
        expert_profile=Expert(),
    )


@pytest.fixture
def repo(inviter: Account) -> MagicMock:
    repository = MagicMock(spec=ReferralRepository)
    repository.find_inviter.return_value = inviter
    repository.find_accounts_by_email.return_value = []
    repository.find_by_email.return_value = None
    return repository


@pytest.fixture
def use_case(repo: MagicMock) -> RegisterReferralUseCase:
    return RegisterReferralUseCase(repo, ReferralValidator(repo))


async def test_registration_without_link_does_not_participate(
    use_case: RegisterReferralUseCase, repo: MagicMock
) -> None:
    result = await use_case.prepare(None, "new@example.com", UserRole.EXPERT)

    assert result is None
    repo.find_inviter.assert_not_awaited()


async def test_new_expert_can_use_link(use_case: RegisterReferralUseCase, inviter: Account) -> None:
    result = await use_case.prepare(inviter.public_id, "new@example.com", UserRole.EXPERT)

    assert result.id == inviter.id


async def test_self_invitation_ignores_email_case(
    use_case: RegisterReferralUseCase, inviter: Account
) -> None:
    with pytest.raises(HTTPException, match="Нельзя пригласить самого себя"):
        await use_case.prepare(inviter.public_id, "INVITER@example.com", UserRole.EXPERT)


@pytest.mark.parametrize("role", [UserRole.CUSTOMER, UserRole.LICENSE_HOLDER])
async def test_other_roles_cannot_participate(
    use_case: RegisterReferralUseCase, inviter: Account, role: UserRole
) -> None:
    with pytest.raises(HTTPException) as error:
        await use_case.prepare(inviter.public_id, "new@example.com", role)

    assert error.value.status_code == 400


@pytest.mark.parametrize("field", ["is_active", "email_verified"])
async def test_inactive_or_unverified_inviter_is_rejected(
    use_case: RegisterReferralUseCase, inviter: Account, field: str
) -> None:
    setattr(inviter, field, False)

    with pytest.raises(HTTPException):
        await use_case.prepare(inviter.public_id, "new@example.com", UserRole.EXPERT)


async def test_invalid_link_is_rejected(use_case: RegisterReferralUseCase, repo: MagicMock) -> None:
    repo.find_inviter.return_value = None

    with pytest.raises(HTTPException):
        await use_case.prepare(str(uuid4()), "new@example.com", UserRole.EXPERT)


@pytest.mark.parametrize("role", list(UserRole))
async def test_existing_account_in_any_role_cannot_be_invited(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account, role: UserRole
) -> None:
    repo.find_accounts_by_email.return_value = [Account(id=2, role=role, email_verified=True)]

    with pytest.raises(HTTPException, match="только новых пользователей"):
        await use_case.prepare(inviter.public_id, "existing@example.com", UserRole.EXPERT)


async def test_unfinished_registration_can_be_retried_with_same_inviter(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account
) -> None:
    repo.find_by_email.return_value = Referral(
        inviter_id=inviter.id,
        invited_id=2,
        status=ReferralStatus.PENDING,
    )
    repo.find_accounts_by_email.return_value = [
        Account(id=2, role=UserRole.EXPERT, email_verified=False),
    ]

    result = await use_case.prepare(inviter.public_id, "new@example.com", UserRole.EXPERT)

    assert result.id == inviter.id


@pytest.mark.parametrize("referral_status", [ReferralStatus.REWARDED, ReferralStatus.POOL_EXHAUSTED])
async def test_completed_participation_cannot_be_reused(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account, referral_status: ReferralStatus
) -> None:
    repo.find_by_email.return_value = Referral(inviter_id=inviter.id, status=referral_status)

    with pytest.raises(HTTPException, match="уже участвовал"):
        await use_case.prepare(inviter.public_id, "new@example.com", UserRole.EXPERT)


async def test_original_inviter_cannot_be_changed(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account
) -> None:
    repo.find_by_email.return_value = Referral(inviter_id=99, status=ReferralStatus.PENDING)

    with pytest.raises(HTTPException, match="уже участвовал"):
        await use_case.prepare(inviter.public_id, "new@example.com", UserRole.EXPERT)


async def test_referral_keeps_normalized_email(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account
) -> None:
    invited = Account(id=2, email="New@Example.com")

    await use_case.execute(invited, inviter)

    saved = repo.add.call_args.args[0]
    assert saved.invited_email == "new@example.com"
    assert saved.inviter_id == inviter.id
    assert saved.invited_id == invited.id


def make_registration(code: str | None) -> UserRegistration:
    """Возвращает данные регистрации исполнителя с указанной реферальной ссылкой."""
    return UserRegistration(
        role=UserRole.EXPERT,
        email="new@example.com",
        password="Secret-123",
        password_confirm="Secret-123",
        research_profile=ResearchProfileInput(research_field="НИР"),
        privacy_consent=True,
        terms_consent=True,
        personal_data_consent=True,
        referral_code=code,
    )


def test_registration_accepts_referral_uuid() -> None:
    code = str(uuid4())

    assert make_registration(code).referral_code == code


def test_registration_rejects_invalid_referral_code() -> None:
    with pytest.raises(ValidationError):
        make_registration("invalid")
