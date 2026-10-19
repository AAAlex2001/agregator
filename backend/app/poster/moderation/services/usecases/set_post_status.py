"""Скрытие поста модератором и возврат в ленту."""

from datetime import UTC, datetime

from app.poster.moderation.schemas import ModerationStatus
from app.poster.publications.models import Post, PostStatus
from app.poster.publications.services.exceptions import PostNotFoundError
from app.poster.publications.services.repo import PostRepository
from app.poster.reports.services.repo import PostReportRepository


class SetPostStatusUseCase:
    """Меняет состояние поста. Жалобы на пост закрываются."""

    def __init__(self, posts: PostRepository, reports: PostReportRepository) -> None:
        self.posts = posts
        self.reports = reports

    async def execute(self, post: Post, status: ModerationStatus) -> Post:
        """Пост в новом состоянии. Черновики модератор не трогает — PostNotFoundError."""

        if post.status == PostStatus.DRAFT:
            raise PostNotFoundError

        post = await self.posts.get_for_update(post.id)
        post.status = PostStatus(status)
        post.updated_at = datetime.now(UTC)
        await self.reports.resolve_post(post.id)

        return await self.posts.save(post)
