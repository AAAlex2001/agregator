"""Сценарий ленты «Подписки»."""

from models.account import Account
from models.posts import Post
from services.posts.follow_repository import FollowRepository
from services.posts.repo import PostRepository


class LoadFollowingFeedUseCase:
    """Посты авторов, на которых пользователь подписан.

    Первая страница отмечает вкладку просмотренной — счётчик новых постов обнуляется.
    """

    def __init__(self, posts: PostRepository, follows: FollowRepository) -> None:
        self.posts = posts
        self.follows = follows

    async def execute(self, user: Account, limit: int, offset: int) -> tuple[list[Post], int]:
        """Страница ленты и сколько постов всего."""

        items, total = await self.posts.list_following(user.id, limit, offset)
        if offset == 0:
            await self.follows.mark_feed_seen(user.id)
        return items, total
