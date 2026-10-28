"""Тесты нового src на настоящей PostgreSQL.

Адрес базы берётся из backend/.env.test: SRC_TEST_DATABASE_URL=postgresql+asyncpg://...<имя>_test.
База создаётся сама, на неё накатываются миграции, перед прогоном данные очищаются.
"""

import asyncio
import os
import subprocess
import sys
from collections.abc import AsyncIterator, Awaitable, Callable
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

import pytest
import pytest_asyncio
from dotenv import load_dotenv

BACKEND = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND / ".env.test")
TEST_DATABASE_URL = os.getenv("SRC_TEST_DATABASE_URL", "")

os.environ["DATABASE_URL"] = TEST_DATABASE_URL or "postgresql+asyncpg://user:password@localhost/not_configured"
os.environ["INTERNAL_API_TOKEN"] = "test-internal-token"
os.environ.setdefault("EMAIL_FROM", "test@example.com")
os.environ.setdefault("UNISENDER_GO_API_KEY", "test")

import asyncpg  # noqa: E402
import httpx  # noqa: E402
from fastapi import FastAPI  # noqa: E402

from src.accounts.models import Account, UserRole  # noqa: E402
from src.auth.sessions.models import Session  # noqa: E402
from src.core.ai import get_ai  # noqa: E402
from src.core.database import SessionLocal  # noqa: E402
from src.core.errors import AppError, app_error_handler  # noqa: E402
from src.core.telegram import get_telegram  # noqa: E402
from src.poster.internal_routes import router as poster_internal_router  # noqa: E402
from src.poster.routes import router as poster_router  # noqa: E402
from src.support.routes import router as support_router  # noqa: E402

INTERNAL_HEADERS = {"X-Internal-Token": "test-internal-token"}


class FakeTelegram:
    """Заглушка Telegram: запоминает вызовы и отвечает как настоящий бот."""

    bot_id = 1

    def __init__(self) -> None:
        """Начинает с пустого списка вызовов."""
        self.calls: list[tuple[str, dict[str, Any]]] = []
        self.next_message_id = 100

    async def call(self, method: str, payload: dict[str, Any]) -> Any:
        """Запоминает вызов метода и возвращает правдоподобный ответ Telegram."""
        self.calls.append((method, payload))

        if method == "getChat":
            return {"type": "channel", "title": "Тестовый канал", "username": "test_channel"}

        if method == "getChatMember":
            return {"status": "administrator", "can_post_messages": True}

        if method == "getChatMemberCount":
            return 42

        if method in ("sendMessage", "sendPoll"):
            self.next_message_id += 1
            return {"message_id": self.next_message_id}

        return True

    async def upload(self, method: str, payload: dict[str, Any], files: dict[str, Path]) -> Any:
        """Запоминает отправку файлов и возвращает сообщения, как Telegram."""
        self.calls.append((method, payload))

        if method == "sendMediaGroup":
            self.next_message_id += len(files)
            return [{"message_id": self.next_message_id - index} for index in range(len(files))]

        self.next_message_id += 1
        return {"message_id": self.next_message_id}

    def methods(self) -> list[str]:
        """Возвращает названия вызванных методов по порядку."""
        return [method for method, _ in self.calls]


class FakeAi:
    """Заглушка нейросети: всегда отвечает одним и тем же текстом."""

    async def complete(self, system_prompt: str, user_message: str, max_tokens: int) -> str:
        """Возвращает готовый текст поста."""
        return "<p>Текст от ИИ</p>"


async def prepare_database() -> None:
    """Создаёт тестовую базу, если её нет, накатывает миграции и очищает данные."""
    database_name = TEST_DATABASE_URL.rsplit("/", 1)[1]
    server_url = TEST_DATABASE_URL.rsplit("/", 1)[0].replace("postgresql+asyncpg://", "postgresql://")
    connection = await asyncpg.connect(f"{server_url}/postgres")

    try:
        exists = await connection.fetchval("SELECT 1 FROM pg_database WHERE datname = $1", database_name)

        if not exists:
            await connection.execute(f'CREATE DATABASE "{database_name}"')
    finally:
        await connection.close()

    await asyncio.to_thread(
        subprocess.run,
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=BACKEND,
        env={**os.environ, "DATABASE_URL": TEST_DATABASE_URL},
        check=True,
        capture_output=True,
    )

    connection = await asyncpg.connect(TEST_DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://"))

    try:
        await connection.execute("TRUNCATE accounts RESTART IDENTITY CASCADE")
    finally:
        await connection.close()


@pytest_asyncio.fixture(scope="session", loop_scope="session")
async def telegram() -> FakeTelegram:
    """Одна заглушка Telegram на весь прогон."""
    return FakeTelegram()


@pytest_asyncio.fixture(scope="session", loop_scope="session")
async def app(telegram: FakeTelegram, tmp_path_factory: pytest.TempPathFactory) -> AsyncIterator[FastAPI]:
    """Готовит базу и собирает приложение из роутеров src с заглушками Telegram и ИИ."""
    if not TEST_DATABASE_URL.endswith("_test"):
        pytest.skip("Впишите SRC_TEST_DATABASE_URL с базой *_test в backend/.env.test")

    await prepare_database()

    uploads = tmp_path_factory.mktemp("uploads")
    patch = pytest.MonkeyPatch()
    patch.setattr("src.poster.posts.storage.UPLOADS_DIR", uploads)
    patch.setattr("src.poster.delivery.publisher.UPLOADS_DIR", uploads)
    patch.setattr("src.support.files.UPLOADS_DIR", uploads)
    patch.setattr("src.poster.delivery.tasks.get_telegram", lambda: telegram)

    application = FastAPI()
    application.add_exception_handler(AppError, app_error_handler)
    application.include_router(poster_router)
    application.include_router(poster_internal_router)
    application.include_router(support_router)
    application.dependency_overrides[get_telegram] = lambda: telegram
    application.dependency_overrides[get_ai] = lambda: FakeAi()
    application.state.uploads = uploads

    yield application

    patch.undo()


UserClientFactory = Callable[..., Awaitable[tuple[Account, httpx.AsyncClient]]]


@pytest_asyncio.fixture(loop_scope="session")
async def user_client(app: FastAPI) -> AsyncIterator[UserClientFactory]:
    """Создаёт пользователя с сессией и клиента, который ходит в приложение от его имени."""
    clients: list[httpx.AsyncClient] = []

    async def create(first_name: str = "Иван") -> tuple[Account, httpx.AsyncClient]:
        """Создаёт аккаунт, сессию входа и клиента с cookie этой сессии."""
        now = datetime.now(UTC)

        async with SessionLocal() as db:
            account = Account(
                role=UserRole.EXPERT,
                email=f"{first_name.lower()}-{now.timestamp()}@example.com",
                password="hash",
                first_name=first_name,
            )
            db.add(account)
            await db.flush()
            session = Session(
                user_id=account.id,
                expires_at=now + timedelta(hours=1),
                max_expires_at=now + timedelta(days=1),
            )
            db.add(session)
            await db.commit()

        client = httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app),
            base_url="http://test/",
            cookies={"session_id": session.session_id},
        )
        clients.append(client)

        return account, client

    yield create

    for client in clients:
        await client.aclose()


@pytest_asyncio.fixture(loop_scope="session")
async def guest(app: FastAPI) -> AsyncIterator[httpx.AsyncClient]:
    """Клиент гостя без входа."""
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test/") as client:
        yield client


@pytest_asyncio.fixture(loop_scope="session")
async def admin(app: FastAPI) -> AsyncIterator[httpx.AsyncClient]:
    """Клиент админки с внутренним токеном."""
    transport = httpx.ASGITransport(app=app)

    async with httpx.AsyncClient(transport=transport, base_url="http://test/", headers=INTERNAL_HEADERS) as client:
        yield client
