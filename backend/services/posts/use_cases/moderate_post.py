"""Сценарии модерации постов и жалоб."""

from datetime import UTC, datetime

from models.posts import Post, PostReport, PostStatus
from services.posts.repo import PostRepository
from services.posts.report_repo import PostReportRepository


class SetPostStatusUseCase:
    """Скрыть пост или вернуть его в ленту. Жалобы на пост закрываются."""

    def __init__(self, posts: PostRepository, reports: PostReportRepository) -> None:
        self.posts = posts
        self.reports = reports

    async def execute(self, post: Post, status: PostStatus) -> Post:
        """Вернуть пост в новом состоянии."""

        post.status = status
        post.updated_at = datetime.now(UTC)
        if status == PostStatus.PUBLISHED and post.published_at is None:
            post.published_at = post.updated_at
        updated = await self.posts.save(post)
        await self.reports.resolve_post(post.id)

        return updated


class DismissReportUseCase:
    """Отклонить жалобу: всё в порядке. Закрываются все жалобы на тот же пост или комментарий."""

    def __init__(self, reports: PostReportRepository) -> None:
        self.reports = reports

    async def execute(self, report: PostReport) -> None:
        """Закрыть жалобы."""

        if report.comment_id is not None:
            await self.reports.resolve_comment(report.comment_id)
            return

        if report.post_id is not None:
            await self.reports.resolve_post(report.post_id)
