from sqlalchemy import func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.reports.models import PostReport, ReportStatus


class ReportRepository:
    """Читает и записывает жалобы на посты и комментарии."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def add_for_post(self, reporter_id: int, post_id: int, reason: str) -> None:
        """Записывает жалобу на пост. Повторная жалоба, пока модератор не решил, ничего не меняет."""
        query = (
            insert(PostReport)
            .values(reporter_id=reporter_id, post_id=post_id, reason=reason)
            .on_conflict_do_nothing()
        )
        await self.db.execute(query)

    async def add_for_comment(self, reporter_id: int, comment_id: int, reason: str) -> None:
        """Записывает жалобу на комментарий. Повторная жалоба, пока модератор не решил, ничего не меняет."""
        query = (
            insert(PostReport)
            .values(reporter_id=reporter_id, comment_id=comment_id, reason=reason)
            .on_conflict_do_nothing()
        )
        await self.db.execute(query)

    async def get(self, report_id: int) -> PostReport | None:
        """Возвращает жалобу по id или None."""
        query = select(PostReport).where(PostReport.id == report_id)
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def list_by_status(self, status: ReportStatus, limit: int, offset: int) -> list[PostReport]:
        """Возвращает жалобы в одном статусе, новые первыми."""
        query = (
            select(PostReport)
            .where(PostReport.status == status)
            .order_by(PostReport.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def count_by_status(self, status: ReportStatus) -> int:
        """Считает жалобы в одном статусе."""
        query = select(func.count()).where(PostReport.status == status)
        result = await self.db.execute(query)

        return result.scalar_one()

    async def resolve_for_post(self, post_id: int) -> None:
        """Закрывает все открытые жалобы на пост: модератор уже решил, что с ним делать."""
        query = (
            update(PostReport)
            .where(PostReport.post_id == post_id, PostReport.status == ReportStatus.OPEN)
            .values(status=ReportStatus.RESOLVED)
        )
        await self.db.execute(query)

    async def save(self) -> None:
        """Сохраняет изменения жалоб в базе."""
        await self.db.flush()
