"""Тесты рефералки используют только отдельную PostgreSQL-базу."""

import os
from collections.abc import AsyncIterator
from uuid import uuid4

import pytest
import pytest_asyncio
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from models.base import Base


@pytest_asyncio.fixture
async def sessions() -> AsyncIterator[async_sessionmaker[AsyncSession]]:
    """Создаёт изолированную схему в базе с именем, заканчивающимся на _test."""
    database_url = os.getenv("REFERRAL_TEST_DATABASE_URL")
    if not database_url:
        pytest.skip("Укажите REFERRAL_TEST_DATABASE_URL для отдельной тестовой базы")

    url = make_url(database_url)
    if not url.database or not url.database.endswith("_test"):
        raise pytest.UsageError("Реферальные тесты требуют отдельную базу с суффиксом _test")

    schema = "test_referrals_" + uuid4().hex
    admin_engine = create_async_engine(url)
    async with admin_engine.begin() as connection:
        await connection.execute(CreateSchema(schema))

    engine = create_async_engine(url, connect_args={"server_settings": {"search_path": schema}})
    try:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)
        yield async_sessionmaker(engine, expire_on_commit=False, autoflush=False)
    finally:
        await engine.dispose()
        async with admin_engine.begin() as connection:
            await connection.execute(DropSchema(schema, cascade=True))
        await admin_engine.dispose()
