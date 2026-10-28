from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.poster.feed.pages import PostPages
from src.poster.feed.repository import FeedRepository
from src.poster.posts.schemas import PostPageResponse


class ListFollowingFeedUseCase:
    """Лента подписок."""

    def __init__(self, feed: FeedRepository, accounts: AccountRepository, pages: PostPages) -> None:
        """Принимает ленты, аккаунты и сборку страниц постов."""
        self.feed = feed
        self.accounts = accounts
        self.pages = pages

    async def execute(self, *, user: Account, limit: int, offset: int) -> PostPageResponse:
        """Возвращает посты авторов из подписок и отмечает, что пользователь их видел."""
        await self.accounts.mark_following_seen(user.id)
        posts, total = await self.feed.list_following(user.id, limit, offset)

        return await self.pages.build(posts, total, user)
