from datetime import UTC, datetime

from src.accounts.models import Account
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository
from src.poster.reactions.repository import ReactionRepository


class CountViewUseCase:
    """Подсчёт просмотров поста."""

    def __init__(self, reactions: ReactionRepository, posts: PostRepository) -> None:
        """Принимает просмотры и посты."""
        self.reactions = reactions
        self.posts = posts

    async def execute(self, *, user: Account | None, visitor_id: str, post_id: int) -> None:
        """Засчитывает просмотр: один человек — раз в день, свои просмотры автору не считаются."""
        post = await self.posts.get_published(post_id)

        if post is None:
            raise PostNotFoundError()

        if user is not None and user.id == post.author_id:
            return

        visitor = f"user:{user.id}" if user is not None else f"anon:{visitor_id}"

        if await self.reactions.add_view(post.id, visitor, datetime.now(UTC).date()):
            await self.posts.add_view(post.id)
