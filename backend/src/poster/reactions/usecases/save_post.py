from src.accounts.models import Account
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository
from src.poster.reactions.repository import ReactionRepository


class SavePostUseCase:
    """Сохранение поста себе."""

    def __init__(self, reactions: ReactionRepository, posts: PostRepository) -> None:
        """Принимает сохранения и посты."""
        self.reactions = reactions
        self.posts = posts

    async def execute(self, *, user: Account, post_id: int) -> None:
        """Добавляет опубликованный пост в сохранённые пользователя."""
        post = await self.posts.get_published(post_id)

        if post is None:
            raise PostNotFoundError()

        await self.reactions.save(user.id, post.id)
