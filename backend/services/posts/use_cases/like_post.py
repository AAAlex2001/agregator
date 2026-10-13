"""Сценарий лайка поста."""

from models.account import Account
from models.posts import Post
from services.posts.notifications import NotificationKind, NotifyUseCase
from services.posts.notifications import PostNotification as Notification
from services.posts.repo import PostLikeRepository, PostRepository


class LikePostUseCase:
    """Поставить лайк и сообщить автору. Повторный лайк уведомления не дублирует."""

    def __init__(self, posts: PostRepository, likes: PostLikeRepository, notify: NotifyUseCase) -> None:
        self.posts = posts
        self.likes = likes
        self.notify = notify

    async def execute(self, user: Account, post: Post) -> int:
        """Вернуть, сколько у поста лайков после нажатия."""

        await self.likes.add(user.id, post.id)
        await self.notify.execute(
            Notification(
                user_id=post.author_id,
                actor_id=user.id,
                kind=NotificationKind.LIKE,
                post_id=post.id,
            )
        )

        return await self.posts.refresh_likes(post.id)
