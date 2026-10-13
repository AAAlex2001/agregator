import asyncio
from datetime import UTC, datetime

from sqlalchemy.dialects import postgresql

from services.posts.ai_repo import AiRequestRepository
from services.posts.comment_repo import PostCommentRepository
from services.posts.repo import PostMediaRepository, PostRepository


class FakeResult:
    def scalars(self):
        return self

    def all(self):
        return []


class RecordingDb:
    """Запоминает SQL запросов в диалекте Postgres."""

    def __init__(self) -> None:
        self.sql: list[str] = []

    def record(self, stmt) -> None:
        self.sql.append(str(stmt.compile(dialect=postgresql.dialect())))

    async def execute(self, stmt):
        self.record(stmt)
        return FakeResult()

    async def scalar(self, stmt):
        self.record(stmt)
        return 0


def test_counters_and_limits_lock_rows_for_no_key_update() -> None:
    db = RecordingDb()

    asyncio.run(PostRepository(db).lock(1))
    asyncio.run(PostMediaRepository(db).count_free(1))
    asyncio.run(PostCommentRepository(db).refresh_count(1))
    asyncio.run(AiRequestRepository(db).list_since(1, datetime.now(UTC)))

    locks = [sql for sql in db.sql if "FOR" in sql]
    assert len(locks) == 4
    assert all(sql.endswith("FOR NO KEY UPDATE") for sql in locks)
