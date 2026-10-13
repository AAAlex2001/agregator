"""Сценарии модерации постов и жалоб."""

from datetime import UTC, datetime

from models.posts import Post, PostReport, PostStatus
from schemas.posts import ModerationStatus
from services.posts.exceptions import PostNotFoundError
from services.posts.repo import PostRepository
from services.posts.report_repo import PostReportRepository


class SetPostStatusUseCase:
    """Скрывает пост или возвращает его в ленту. Жалобы на пост закрываются."""

    def __init__(self, posts: PostRepository, reports: PostReportRepository) -> None:
        self.posts = posts
        self.reports = reports

    async def execute(self, post: Post, status: ModerationStatus) -> Post:
        """Пост в новом состоянии. Черновики модератор не трогает — PostNotFoundError."""

        if post.status == PostStatus.DRAFT:
            raise PostNotFoundError()
        post = await self.posts.get_for_update(post.id)
        post.status = PostStatus(status)
        post.updated_at = datetime.now(UTC)
        await self.reports.resolve_post(post.id)
        return await self.posts.save(post)


class DismissReportUseCase:
    """Отклоняет жалобу: закрываются все жалобы на тот же пост или комментарий."""

    def __init__(self, reports: PostReportRepository) -> None:
        self.reports = reports

    async def execute(self, report: PostReport) -> None:
        """Закрывает жалобы."""

        if report.comment_id is not None:
            await self.reports.resolve_comment(report.comment_id)
        if report.post_id is not None:
            await self.reports.resolve_post(report.post_id)
