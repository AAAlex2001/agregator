"""Изолированные проверки публикаций на отдельной PostgreSQL-базе."""

import os
from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.auth.sessions.models import Session
from app.core.base import Base
from models.account import Account, UserRole


@pytest_asyncio.fixture
async def posts_database():
    """Создаёт отдельную схему, которую удаляет только после теста."""
    raw_url = os.getenv("POSTS_TEST_DATABASE_URL")
    if not raw_url:
        pytest.skip("Укажите POSTS_TEST_DATABASE_URL для базы с суффиксом _test")
    url = make_url(raw_url)
    if not url.database or not url.database.endswith("_test"):
        raise pytest.UsageError("Тесты публикаций требуют отдельную базу *_test")
    schema = "test_posts_" + uuid4().hex
    admin = create_async_engine(url)
    async with admin.begin() as connection:
        await connection.execute(CreateSchema(schema))
    engine = create_async_engine(url, connect_args={"server_settings": {"search_path": schema}})
    sessions = async_sessionmaker(engine, expire_on_commit=False, autoflush=False)
    try:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)
        async with sessions() as db:
            users = [
                Account(
                    role=UserRole.EXPERT,
                    first_name=name,
                    email=f"post-{index}@example.test",
                    password="test-only",
                )
                for index, name in enumerate(["Автор", "Читатель", "Другой"])
            ]
            db.add_all(users)
            await db.flush()
            for index, user in enumerate(users):
                db.add(
                    Session(
                        user_id=user.id,
                        session_id=f"posts-test-{index}",
                        expires_at=datetime.now(UTC) + timedelta(hours=1),
                        max_expires_at=datetime.now(UTC) + timedelta(days=1),
                    )
                )
            await db.commit()
        yield sessions
    finally:
        await engine.dispose()
        async with admin.begin() as connection:
            await connection.execute(DropSchema(schema, cascade=True))
        await admin.dispose()


@pytest_asyncio.fixture
async def post_client(posts_database, monkeypatch, tmp_path):
    """Подключает реальную API к изолированной базе и временным файлам."""
    monkeypatch.setenv("DATABASE_URL", os.environ["POSTS_TEST_DATABASE_URL"])
    monkeypatch.setenv("INTERNAL_API_TOKEN", "posts-test-admin")

    from app.core.config import get_settings
    from app.core.database import get_db
    from app.core.errors import AppError, app_error_handler
    from app.poster.media.services import storage
    from app.poster.moderation.routes import router as admin_router
    from app.poster.routes import router

    async def database():
        async with posts_database() as db:
            try:
                yield db
                await db.commit()
            except Exception:
                await db.rollback()
                raise

    get_settings.cache_clear()
    monkeypatch.setattr(storage, "UPLOADS_DIR", tmp_path)
    app = FastAPI()
    app.add_exception_handler(AppError, app_error_handler)
    app.include_router(router, prefix="/api")
    app.include_router(admin_router, prefix="/api")
    app.dependency_overrides[get_db] = database
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
    get_settings.cache_clear()
