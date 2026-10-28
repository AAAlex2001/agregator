from src.accounts.models import Account
from src.notifications.usecases.notify_post_activity import NotifyPostActivityUseCase
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository
from src.poster.reactions.repository import ReactionRepository
from src.poster.reactions.schemas import LikesResponse


class LikePostUseCase:
    """Лайк под постом."""

    def __init__(
        self,
        reactions: ReactionRepository,
        posts: PostRepository,
        notify: NotifyPostActivityUseCase,
    ) -> None:
        """Принимает лайки, посты и отправку уведомлений."""
        self.reactions = reactions
        self.posts = posts
        self.notify = notify

    async def execute(self, *, user: Account, post_id: int) -> LikesResponse:
        """Ставит лайк, прибавляет счётчик и уведомляет автора. Повторный лайк ничего не меняет."""
        post = await self.posts.get_published(post_id)

        if post is None:
            raise PostNotFoundError()

        if not await self.reactions.like(user.id, post.id):
            return LikesResponse(likes_count=post.likes_count, liked=True)

        likes_count = await self.posts.change_likes_count(post.id, 1)
        await self.notify.execute(
            recipient_id=post.author_id,
            actor=user,
            kind="like",
            post_id=post.id,
        )

        return LikesResponse(likes_count=likes_count, liked=True)
