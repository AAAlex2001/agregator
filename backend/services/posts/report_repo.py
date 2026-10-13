"""Репозиторий жалоб: post_reports. Одна открытая жалоба пользователя на один пост или комментарий."""

from sqlalchemy import func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.posts import OPEN_ONLY, PostReport, ReportStatus


class PostReportRepository:
    """Доступ к таблице post_reports."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, report_id: int) -> PostReport | None:
        """Жалоба по id или None."""

        return await self.db.get(PostReport, report_id)

    async def add_for_post(self, reporter_id: int, post_id: int, reason: str) -> None:
        """Жалоба на пост. Повторная, пока первая не рассмотрена, ничего не меняет."""

        stmt = insert(PostReport).values(reporter_id=reporter_id, post_id=post_id, reason=reason)
        await self.db.execute(
            stmt.on_conflict_do_nothing(index_elements=["reporter_id", "post_id"], index_where=OPEN_ONLY)
        )

    async def add_for_comment(self, reporter_id: int, comment_id: int, reason: str) -> None:
        """Жалоба на комментарий. Повторная, пока первая не рассмотрена, ничего не меняет."""

        stmt = insert(PostReport).values(reporter_id=reporter_id, comment_id=comment_id, reason=reason)
        await self.db.execute(
            stmt.on_conflict_do_nothing(index_elements=["reporter_id", "comment_id"], index_where=OPEN_ONLY)
        )

    async def list_by_status(
        self, status: ReportStatus, limit: int, offset: int
    ) -> tuple[list[PostReport], int]:
        """Жалобы в одном состоянии, новые первыми, и сколько их всего."""

        condition = PostReport.status == status
        stmt = (
            select(PostReport).where(condition).order_by(PostReport.created_at.desc(), PostReport.id.desc())
        )
        items = (await self.db.execute(stmt.limit(limit).offset(offset))).unique().scalars().all()
        total = await self.db.scalar(select(func.count()).select_from(PostReport).where(condition))
        return list(items), total or 0

    async def resolve_post(self, post_id: int) -> None:
        """Закрывает открытые жалобы на пост."""

        await self.db.execute(
            update(PostReport)
            .where(PostReport.post_id == post_id, PostReport.status == ReportStatus.OPEN)
            .values(status=ReportStatus.RESOLVED)
        )

    async def resolve_comment(self, comment_id: int) -> None:
        """Закрывает открытые жалобы на комментарий."""

        await self.db.execute(
            update(PostReport)
            .where(PostReport.comment_id == comment_id, PostReport.status == ReportStatus.OPEN)
            .values(status=ReportStatus.RESOLVED)
        )
