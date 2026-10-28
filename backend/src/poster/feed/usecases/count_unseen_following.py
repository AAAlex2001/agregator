from src.accounts.models import Account
from src.poster.feed.repository import FeedRepository
from src.poster.feed.schemas import UnseenCountResponse


class CountUnseenFollowingUseCase:
    """Счётчик новых постов в подписках."""

    def __init__(self, feed: FeedRepository) -> None:
        """Принимает ленты."""
        self.feed = feed

    async def execute(self, *, user: Account) -> UnseenCountResponse:
        """Считает посты в подписках, которые вышли после последнего открытия ленты подписок."""
        count = await self.feed.count_following_since(user.id, user.following_seen_at)

        return UnseenCountResponse(count=count)
