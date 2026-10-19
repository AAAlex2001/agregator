"""Лента «Подписки»."""

from app.poster.feed.services.repo import FeedRepository
from app.poster.follows.services.repo import FollowRepository
from app.poster.publications.models import Post
from models.account import Account


class LoadFollowingFeedUseCase:
    """Посты авторов из подписок. Первая страница обнуляет счётчик новых постов."""

    def __init__(self, feed: FeedRepository, follows: FollowRepository) -> None:
        self.feed = feed
        self.follows = follows

    async def execute(self, user: Account, limit: int, offset: int) -> tuple[list[Post], int]:
        """Страница ленты и сколько постов всего."""

        items, total = await self.feed.list_following(user.id, limit, offset)
        if offset == 0:
            await self.follows.mark_feed_seen(user.id)

        return items, total
