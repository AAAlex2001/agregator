from src.accounts.models import Account
from src.poster.feed.pages import PostPages
from src.poster.feed.repository import FeedRepository
from src.poster.posts.models import PostStatus
from src.poster.posts.schemas import PostPageResponse


class ListMyPostsUseCase:
    """Мои посты в одном состоянии."""

    def __init__(self, feed: FeedRepository, pages: PostPages) -> None:
        """Принимает ленты и сборку страниц постов."""
        self.feed = feed
        self.pages = pages

    async def execute(
        self,
        *,
        user: Account,
        status: PostStatus,
        limit: int,
        offset: int,
    ) -> PostPageResponse:
        """Возвращает свои опубликованные посты, черновики, отложенные или скрытые."""
        posts, total = await self.feed.list_own(user.id, status, limit, offset)

        return await self.pages.build(posts, total, user)
