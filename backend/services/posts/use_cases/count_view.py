"""Сценарий подсчёта просмотра поста."""

from datetime import UTC, datetime

from models.account import Account
from models.posts import Post
from services.posts.repo import PostRepository, PostViewRepository


class CountPostViewUseCase:
    """Засчитывает просмотр: один посетитель — один раз в сутки, автор не считается."""

    def __init__(self, posts: PostRepository, views: PostViewRepository) -> None:
        self.posts = posts
        self.views = views

    async def execute(self, post: Post, user: Account | None, visitor: str) -> None:
        """Прибавляет просмотр, если посетитель сегодня этот пост ещё не видел."""

        if user is not None and user.id == post.author_id:
            return
        if await self.views.add_once(post.id, visitor, datetime.now(UTC).date()):
            await self.posts.add_view(post.id)
