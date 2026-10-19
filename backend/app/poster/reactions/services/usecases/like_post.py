"""Лайк поста."""

from app.poster.notifications import ActivityNotifier
from app.poster.publications.models import Post
from app.poster.reactions.schemas import LikesSchema
from app.poster.reactions.services.repo import PostLikeRepository
from models.account import Account


class LikePostUseCase:
    """Ставит или убирает лайк. Автору сообщается только о новом лайке."""

    def __init__(self, likes: PostLikeRepository, notify: ActivityNotifier) -> None:
        self.likes = likes
        self.notify = notify

    async def execute(self, user: Account, post: Post, liked: bool) -> LikesSchema:
        """Лайки поста после нажатия. Повторное нажатие ничего не меняет."""

        if not liked:
            await self.likes.remove(user.id, post.id)
        elif await self.likes.add(user.id, post.id):
            await self.notify.execute(post.author_id, user, "like", post_id=post.id)

        likes_count = await self.likes.refresh_count(post.id)

        return LikesSchema(likes_count=likes_count, liked=liked)
