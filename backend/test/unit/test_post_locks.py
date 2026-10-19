"""Счётчики и лимиты постов блокируют строку FOR NO KEY UPDATE: не мешают вставкам по внешнему ключу."""

import asyncio
from datetime import UTC, datetime

from sqlalchemy.dialects import postgresql

from app.poster.ai.services.repo import AiRequestRepository
from app.poster.comments.services.repo import PostCommentRepository
from app.poster.media.services.repo import PostMediaRepository
from app.poster.publications.services.repo import lock_post


class FakeScalars(list):
    pass


class RecordingDb:
    """Запоминает SQL запросов в диалекте Postgres."""

    def __init__(self) -> None:
        self.sql: list[str] = []

    def record(self, stmt) -> None:
        self.sql.append(str(stmt.compile(dialect=postgresql.dialect())))

    async def execute(self, stmt):
        self.record(stmt)

    async def scalar(self, stmt):
        self.record(stmt)
        return 0

    async def scalars(self, stmt):
        self.record(stmt)
        return FakeScalars()


def test_counters_and_limits_lock_rows_for_no_key_update() -> None:
    db = RecordingDb()

    asyncio.run(lock_post(db, 1))
    asyncio.run(PostMediaRepository(db).count_free(1))
    asyncio.run(PostCommentRepository(db).refresh_count(1))
    asyncio.run(AiRequestRepository(db).list_since(1, datetime.now(UTC)))

    locks = [sql for sql in db.sql if "FOR" in sql]

    assert len(locks) == 4
    assert all(sql.endswith("FOR NO KEY UPDATE") for sql in locks)
