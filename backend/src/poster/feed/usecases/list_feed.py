from src.accounts.models import Account
from src.poster.feed.pages import PostPages
from src.poster.feed.repository import FeedRepository
from src.poster.posts.schemas import PostPageResponse


class ListFeedUseCase:
    """Лента «Для вас»."""

    def __init__(self, feed: FeedRepository, pages: PostPages) -> None:
        """Принимает ленты и сборку страниц постов."""
        self.feed = feed
        self.pages = pages

    async def execute(self, *, user: Account | None, limit: int, offset: int) -> PostPageResponse:
        """Возвращает страницу всех постов на сайте, новые первыми."""
        posts, total = await self.feed.list_published(limit, offset)

        return await self.pages.build(posts, total, user)
