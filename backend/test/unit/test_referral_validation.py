"""Участие только новых исполнителей; ошибки ссылки не мешают регистрации."""

from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from pydantic import ValidationError

from models.account import Account, UserRole
from models.expert import Expert
from models.referral import Referral, ReferralStatus
from schemas.registration import UserRegistration
from schemas.research import ResearchProfileInput
from services.referrals import ReferralRepository, ReferralValidator, RegisterReferralUseCase
from services.referrals.emails import canonical_email


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
def invited() -> Account:
    return Account(id=2, role=UserRole.EXPERT, email="New@Example.com")


@pytest.fixture
def repo(inviter: Account) -> MagicMock:
    repository = MagicMock(spec=ReferralRepository)
    repository.find_inviter.return_value = inviter
    repository.has_other_accounts.return_value = False
    repository.find_by_email.return_value = None
    return repository


@pytest.fixture
def use_case(repo: MagicMock) -> RegisterReferralUseCase:
    return RegisterReferralUseCase(repo, ReferralValidator(repo))


async def test_new_expert_is_linked_to_inviter(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account, invited: Account
) -> None:
    await use_case.execute(invited, inviter.public_id)

    saved = repo.add.call_args.args[0]
    assert saved.inviter_id == inviter.id
    assert saved.invited_id == invited.id
    assert saved.invited_email == "new@example.com"


async def test_registration_without_link_does_not_participate(
    use_case: RegisterReferralUseCase, repo: MagicMock, invited: Account
) -> None:
    await use_case.execute(invited, None)

    repo.find_inviter.assert_not_awaited()
    repo.add.assert_not_awaited()


@pytest.mark.parametrize("role", [UserRole.CUSTOMER, UserRole.LICENSE_HOLDER])
async def test_other_roles_do_not_participate(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account, invited: Account, role: UserRole
) -> None:
    invited.role = role

    await use_case.execute(invited, inviter.public_id)

    repo.add.assert_not_awaited()


@pytest.mark.parametrize("field", ["is_active", "email_verified"])
async def test_inactive_or_unverified_inviter_is_ignored(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account, invited: Account, field: str
) -> None:
    setattr(inviter, field, False)

    await use_case.execute(invited, inviter.public_id)

    repo.add.assert_not_awaited()


async def test_unknown_link_is_ignored(
    use_case: RegisterReferralUseCase, repo: MagicMock, invited: Account
) -> None:
    repo.find_inviter.return_value = None

    await use_case.execute(invited, str(uuid4()))

    repo.add.assert_not_awaited()


@pytest.mark.parametrize("email", ["INVITER@example.com", "inviter+second@example.com"])
async def test_self_invitation_is_ignored(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account, invited: Account, email: str
) -> None:
    invited.email = email

    await use_case.execute(invited, inviter.public_id)

    repo.add.assert_not_awaited()


async def test_existing_user_is_ignored(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account, invited: Account
) -> None:
    repo.has_other_accounts.return_value = True

    await use_case.execute(invited, inviter.public_id)

    repo.has_other_accounts.assert_awaited_once_with(invited.email, invited.id)
    repo.add.assert_not_awaited()


@pytest.mark.parametrize("code_present", [True, False])
async def test_pending_invitation_moves_to_new_registration(
    use_case: RegisterReferralUseCase,
    repo: MagicMock,
    inviter: Account,
    invited: Account,
    code_present: bool,
) -> None:
    referral = Referral(inviter_id=inviter.id, invited_id=None, status=ReferralStatus.PENDING)
    repo.find_by_email.return_value = referral

    await use_case.execute(invited, inviter.public_id if code_present else None)

    assert referral.invited_id == invited.id
    assert referral.inviter_id == inviter.id
    repo.add.assert_not_awaited()


async def test_original_inviter_is_kept(
    use_case: RegisterReferralUseCase, repo: MagicMock, inviter: Account, invited: Account
) -> None:
    referral = Referral(inviter_id=99, invited_id=None, status=ReferralStatus.PENDING)
    repo.find_by_email.return_value = referral

    await use_case.execute(invited, inviter.public_id)

    assert referral.inviter_id == 99
    repo.add.assert_not_awaited()


@pytest.mark.parametrize(
    "referral_status",
    [ReferralStatus.REWARDED, ReferralStatus.POOL_EXHAUSTED, ReferralStatus.REJECTED],
)
async def test_completed_participation_is_not_reused(
    use_case: RegisterReferralUseCase,
    repo: MagicMock,
    inviter: Account,
    invited: Account,
    referral_status: ReferralStatus,
) -> None:
    referral = Referral(inviter_id=inviter.id, invited_id=None, status=referral_status)
    repo.find_by_email.return_value = referral

    await use_case.execute(invited, inviter.public_id)

    assert referral.invited_id is None
    repo.add.assert_not_awaited()


@pytest.mark.parametrize(
    ("email", "expected"),
    [
        ("  Ivan@Example.com ", "ivan@example.com"),
        ("ivan+promo@example.com", "ivan@example.com"),
        ("I.van+1@gmail.com", "ivan@gmail.com"),
        ("i.van@googlemail.com", "ivan@gmail.com"),
        ("ivan.petrov+x@ya.ru", "ivan-petrov@yandex.ru"),
        ("ivan-petrov@yandex.com", "ivan-petrov@yandex.ru"),
        ("i.van@mail.ru", "i.van@mail.ru"),
        (None, ""),
    ],
)
def test_mailbox_aliases_have_one_canonical_email(email: str | None, expected: str) -> None:
    assert canonical_email(email) == expected


def make_registration(code: str | None) -> UserRegistration:
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
