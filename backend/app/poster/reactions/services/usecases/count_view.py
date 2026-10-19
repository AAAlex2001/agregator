"""Просмотр поста."""

from datetime import UTC, datetime

from app.poster.publications.models import Post
from app.poster.reactions.services.repo import PostViewRepository
from models.account import Account


class CountViewUseCase:
    """Засчитывает просмотр: один посетитель — один раз в сутки, автор не считается."""

    def __init__(self, views: PostViewRepository) -> None:
        self.views = views

    async def execute(self, post: Post, user: Account | None, visitor: str) -> None:
        """Прибавляет просмотр, если посетитель сегодня этот пост ещё не видел."""

        if user is not None and user.id == post.author_id:
            return

        if await self.views.add_once(post.id, visitor, datetime.now(UTC).date()):
            await self.views.increment(post.id)
