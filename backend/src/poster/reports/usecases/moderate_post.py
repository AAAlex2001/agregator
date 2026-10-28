from datetime import UTC, datetime

from src.accounts.repository import AccountRepository
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.models import PostStatus
from src.poster.posts.repository import PostRepository
from src.poster.posts.schemas import PostResponse, author_ids
from src.poster.reports.repository import ReportRepository
from src.poster.reports.schemas import ModerationStatus


class ModeratePostUseCase:
    """Модератор скрывает пост или возвращает его на сайт."""

    def __init__(self, posts: PostRepository, reports: ReportRepository, accounts: AccountRepository) -> None:
        """Принимает посты, жалобы и аккаунты."""
        self.posts = posts
        self.reports = reports
        self.accounts = accounts

    async def execute(self, *, post_id: int, status: ModerationStatus) -> PostResponse:
        """Скрывает опубликованный пост или возвращает скрытый и закрывает жалобы на него."""
        post = await self.posts.get(post_id)

        if post is None or post.status not in (PostStatus.PUBLISHED, PostStatus.HIDDEN):
            raise PostNotFoundError()

        post.status = PostStatus(status)

        if post.status == PostStatus.PUBLISHED and post.published_at is None:
            post.published_at = datetime.now(UTC)

        await self.posts.save()
        await self.reports.resolve_for_post(post.id)

        authors = await self.accounts.list_by_ids(author_ids([post]))

        return PostResponse.from_post(post, authors)
