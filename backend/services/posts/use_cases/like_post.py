"""Сценарий лайка поста."""

from models.account import Account
from models.posts import Post
from schemas.posts import LikesSchema
from services.notifications.use_cases.create_post_activity_notification import (
    CreatePostActivityNotificationUseCase,
)
from services.posts.repo import PostLikeRepository, PostRepository


class LikePostUseCase:
    """Ставит или убирает лайк. Автору сообщается только о новом лайке."""

    def __init__(
        self,
        posts: PostRepository,
        likes: PostLikeRepository,
        notify: CreatePostActivityNotificationUseCase,
    ) -> None:
        self.posts = posts
        self.likes = likes
        self.notify = notify

    async def execute(self, user: Account, post: Post, liked: bool) -> LikesSchema:
        """Лайки поста после нажатия. Повторное нажатие ничего не меняет."""

        if liked and await self.likes.add(user.id, post.id):
            await self.notify.execute(post.author_id, user, "like", post_id=post.id)
        if not liked:
            await self.likes.remove(user.id, post.id)
        return LikesSchema(likes_count=await self.posts.refresh_likes(post.id), liked=liked)
