"""Проверяет рефералку через HTTP, регистрацию и подтверждение почты."""

from collections.abc import AsyncIterator
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from unittest.mock import MagicMock

import httpx
import pytest
import pytest_asyncio
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from database.database import get_db
from dependencies.registration import get_registration_notifier
from models.account import Account, UserRole
from models.expert import Expert
from models.referral import ReferralCampaign
from models.session import Session
from routes import cadastral, referral, registration, settings
from schemas.referral import ReferralOverview
from schemas.registration import EmailConfirmRequest, UserRegistration, UserResponse
from schemas.research import ResearchProfileInput
from services.referrals import BonusRepository
from services.registration import RegistrationNotifier
from services.verification import VerificationService

pytestmark = pytest.mark.integration
SessionFactory = async_sessionmaker[AsyncSession]


@dataclass
class AuthorizedAccount:
    """Данные для HTTP-запросов от имени тестового аккаунта."""

    user_id: int
    public_id: str
    session_id: str


async def create_account(
    sessions: SessionFactory,
    role: UserRole = UserRole.EXPERT,
    email_verified: bool = True,
) -> AuthorizedAccount:
    """Создаёт аккаунт с действующей сессией и фонд программы."""
    async with sessions.begin() as db:
        account = Account(
            role=role,
            email="inviter@example.com",
            password="unused",
            first_name="Иван",
            email_verified=email_verified,
            is_active=True,
        )
        if role == UserRole.EXPERT:
            account.expert_profile = Expert(certificates=[])
        db.add(account)
        db.add(ReferralCampaign(id=1, total_kopecks=100_000_000, reward_kopecks=300_000))
        await db.flush()
        expires = datetime.now(UTC) + timedelta(days=1)
        session = Session(user_id=account.id, expires_at=expires, max_expires_at=expires)
        db.add(session)
        await db.flush()
        return AuthorizedAccount(account.id, account.public_id, session.session_id)


@pytest_asyncio.fixture
async def api(sessions: SessionFactory) -> AsyncIterator[httpx.AsyncClient]:
    """Подключает HTTP-обработчики к изолированной схеме без отправки писем."""
    app = FastAPI()
    for router in [registration.router, referral.router, cadastral.router, settings.router]:
        app.include_router(router, prefix="/api")

    async def test_db() -> AsyncIterator[AsyncSession]:
        """Коммитит запрос только в отдельной тестовой схеме."""
        async with sessions.begin() as db:
            yield db

    async def skip_rate_limit() -> None:
        """Тесты бизнес-логики не используют внешний Redis."""
        return

    notifier = MagicMock(spec=RegistrationNotifier)

    def test_notifier() -> RegistrationNotifier:
        """Возвращает заглушку отправки писем."""
        return notifier

    app.dependency_overrides[get_db] = test_db
    app.dependency_overrides[get_registration_notifier] = test_notifier
    for route in registration.router.routes:
        for dependency in route.dependencies:
            app.dependency_overrides[dependency.dependency] = skip_rate_limit

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app), base_url="https://test") as client:
        yield client


async def test_cabinet_requires_authorization(api: httpx.AsyncClient) -> None:
    response = await api.get("/api/referrals/me")

    assert response.status_code == 401


@pytest.mark.parametrize(
    ("role", "email_verified"),
    [(UserRole.CUSTOMER, True), (UserRole.EXPERT, False)],
)
async def test_cabinet_rejects_other_roles_and_unverified_email(
    api: httpx.AsyncClient,
    sessions: SessionFactory,
    role: UserRole,
    email_verified: bool,
) -> None:
    account = await create_account(sessions, role, email_verified)
    api.cookies.set("session_id", account.session_id)

    response = await api.get("/api/referrals/me")

    assert response.status_code == 403


async def test_empty_cabinet_returns_link_and_zero_counters(
    api: httpx.AsyncClient,
    sessions: SessionFactory,
) -> None:
    inviter = await create_account(sessions)
    api.cookies.set("session_id", inviter.session_id)

    response = await api.get("/api/referrals/me")
    overview = ReferralOverview.model_validate_json(response.content)

    assert response.status_code == 200
    assert overview.referral_code == inviter.public_id
    assert overview.invited_count == 0
    assert overview.balance_kopecks == 0
    assert overview.reward_kopecks == 300_000
    assert overview.withdrawal_allowed is False


async def test_registration_confirmation_and_profile_update_credit_once(
    api: httpx.AsyncClient,
    sessions: SessionFactory,
) -> None:
    inviter = await create_account(sessions)
    data = UserRegistration(
        role=UserRole.EXPERT,
        email="new@example.com",
        first_name="Пётр",
        password="Secret-123",
        password_confirm="Secret-123",
        research_profile=ResearchProfileInput(research_field="НИР"),
        privacy_consent=True,
        terms_consent=True,
        personal_data_consent=True,
        referral_code=inviter.public_id,
    )
    response = await api.post("/api/register/", data={"payload": data.model_dump_json()})
    assert response.status_code == 201, response.text
    invited = UserResponse.model_validate_json(response.content)

    async with sessions.begin() as db:
        assert await BonusRepository(db).get_balance(inviter.user_id) == 0
        code = await VerificationService(db).issue_code(invited.id)

    confirmation = EmailConfirmRequest(email=data.email, code=code, role=UserRole.EXPERT)
    response = await api.post(
        "/api/register/confirm-email",
        content=confirmation.model_dump_json(),
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 200, response.text

    async with sessions() as db:
        assert await BonusRepository(db).get_balance(inviter.user_id) == 300_000

    response = await api.put("/api/settings/profile", json={"first_name": "Пётр"})
    assert response.status_code == 200, response.text
    response = await api.put(
        "/api/directions/cadastral/profile", json={"education": "Профильное образование"}
    )
    assert response.status_code == 200, response.text

    async with sessions() as db:
        assert await BonusRepository(db).get_balance(inviter.user_id) == 300_000
