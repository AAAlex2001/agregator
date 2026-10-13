"""Проверяет прямую и обратную миграцию на отдельной тестовой схеме."""

import importlib.util
import os
from pathlib import Path
from uuid import uuid4

import pytest
from sqlalchemy import text
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from alembic.migration import MigrationContext
from alembic.operations import Operations

pytestmark = pytest.mark.integration


async def test_posts_migration_upgrade_downgrade_upgrade():
    """Создаёт таблицы, откатывает данные постов и повторно применяет миграцию."""
    raw_url = os.getenv("POSTS_TEST_DATABASE_URL")
    if not raw_url:
        pytest.skip("Укажите POSTS_TEST_DATABASE_URL")
    url = make_url(raw_url)
    if not url.database or not url.database.endswith("_test"):
        raise pytest.UsageError("Нужна отдельная база *_test")
    schema = "test_posts_migration_" + uuid4().hex
    admin = create_async_engine(url)
    async with admin.begin() as connection:
        await connection.execute(CreateSchema(schema))
    engine = create_async_engine(url, connect_args={"server_settings": {"search_path": schema}})
    path = Path(__file__).resolve().parents[2] / "alembic/versions/178_posts.py"
    spec = importlib.util.spec_from_file_location("migration_posts", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    indexes_path = path.with_name("179_posts_query_indexes.py")
    indexes_spec = importlib.util.spec_from_file_location("migration_posts_indexes", indexes_path)
    indexes = importlib.util.module_from_spec(indexes_spec)
    indexes_spec.loader.exec_module(indexes)

    def apply(connection, action):
        """Выполняет миграцию в тестовой схеме."""
        with Operations.context(MigrationContext.configure(connection)):
            action()

    try:
        async with engine.begin() as connection:
            await connection.execute(
                text(
                    "CREATE TABLE accounts (id integer PRIMARY KEY, notification_unread_count integer NOT NULL DEFAULT 0)"
                )
            )
            await connection.execute(
                text("""CREATE TYPE notificationtype AS ENUM (
                'RESPONSE_UPDATED','RESPONSE_STATUS_CHANGED','CHAT_MESSAGE','QUESTION_ASKED',
                'QUESTION_ANSWERED','SUPPORT_REPLY','NEW_BLOG_POST','NEW_ORDER','CONTACT_ACCESS','LABOR_RESPONSE')""")
            )
            await connection.execute(
                text(
                    "CREATE TABLE notifications (id integer PRIMARY KEY, user_id integer REFERENCES accounts(id), type notificationtype, is_read boolean NOT NULL DEFAULT false)"
                )
            )
            await connection.run_sync(apply, migration.upgrade)
            await connection.run_sync(apply, indexes.upgrade)
            assert (await connection.execute(text("SELECT to_regclass('ix_posts_sitemap')"))).scalar()
            assert (
                await connection.execute(text("SELECT to_regclass('ix_posts_author_feed')"))
            ).scalar() is None
        async with engine.begin() as connection:
            await connection.execute(
                text("INSERT INTO accounts (id, notification_unread_count) VALUES (1, 2)")
            )
            await connection.execute(
                text(
                    "INSERT INTO notifications (id,user_id,type) VALUES (1,1,'POST_ACTIVITY'),(2,1,'CHAT_MESSAGE')"
                )
            )
            await connection.run_sync(apply, indexes.downgrade)
            assert (await connection.execute(text("SELECT to_regclass('ix_posts_author_feed')"))).scalar()
            assert (await connection.execute(text("SELECT to_regclass('ix_posts_sitemap')"))).scalar() is None
            await connection.run_sync(apply, migration.downgrade)
            assert (
                await connection.execute(text("SELECT notification_unread_count FROM accounts WHERE id=1"))
            ).scalar() == 1
            assert (await connection.execute(text("SELECT count(*) FROM notifications"))).scalar() == 1
            assert (await connection.execute(text("SELECT to_regclass('posts')"))).scalar() is None
        async with engine.begin() as connection:
            await connection.run_sync(apply, migration.upgrade)
            await connection.run_sync(apply, indexes.upgrade)
            assert (await connection.execute(text("SELECT to_regclass('ix_posts_sitemap')"))).scalar()
            assert (
                await connection.execute(text("SELECT to_regclass('ix_posts_author_feed')"))
            ).scalar() is None
            assert (await connection.execute(text("SELECT to_regclass('posts')"))).scalar() == "posts"
    finally:
        await engine.dispose()
        async with admin.begin() as connection:
            await connection.execute(DropSchema(schema, cascade=True))
        await admin.dispose()
