from src.accounts.models import Account
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository
from src.poster.reports.repository import ReportRepository
from src.poster.reports.schemas import ReportRequest


class ReportPostUseCase:
    """Жалоба на пост."""

    def __init__(self, reports: ReportRepository, posts: PostRepository) -> None:
        """Принимает жалобы и посты."""
        self.reports = reports
        self.posts = posts

    async def execute(self, *, user: Account, post_id: int, data: ReportRequest) -> None:
        """Записывает жалобу на опубликованный пост для модератора."""
        post = await self.posts.get_published(post_id)

        if post is None:
            raise PostNotFoundError()

        await self.reports.add_for_post(user.id, post.id, data.reason)
