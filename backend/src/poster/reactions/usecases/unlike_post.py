from src.accounts.models import Account
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository
from src.poster.reactions.repository import ReactionRepository
from src.poster.reactions.schemas import LikesResponse


class UnlikePostUseCase:
    """Снятие лайка с поста."""

    def __init__(self, reactions: ReactionRepository, posts: PostRepository) -> None:
        """Принимает лайки и посты."""
        self.reactions = reactions
        self.posts = posts

    async def execute(self, *, user: Account, post_id: int) -> LikesResponse:
        """Снимает лайк и убавляет счётчик. Если лайка не было, ничего не меняет."""
        post = await self.posts.get_published(post_id)

        if post is None:
            raise PostNotFoundError()

        if not await self.reactions.unlike(user.id, post.id):
            return LikesResponse(likes_count=post.likes_count, liked=False)

        likes_count = await self.posts.change_likes_count(post.id, -1)

        return LikesResponse(likes_count=likes_count, liked=False)
