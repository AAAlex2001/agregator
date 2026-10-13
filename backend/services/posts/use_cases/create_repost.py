"""Сценарий репоста."""

from datetime import UTC, datetime

from models.account import Account
from models.posts import Post, PostStatus
from schemas.posts import RepostSaveSchema
from services.posts.html import clean_html
from services.posts.notifications import NotificationKind, NotifyUseCase
from services.posts.notifications import PostNotification as Notification
from services.posts.repo import PostRepository


class CreateRepostUseCase:
    """Репостнуть публикацию сразу: просто или с комментарием. Репост репоста ведёт на оригинал.

    Автору оригинала приходит уведомление.
    """

    def __init__(self, posts: PostRepository, notify: NotifyUseCase) -> None:
        self.posts = posts
        self.notify = notify

    async def execute(self, user: Account, post: Post, payload: RepostSaveSchema) -> Post:
        """Вернуть опубликованный репост и пересчитать репосты оригинала."""

        original = post.repost_of or post
        repost = Post(
            author_id=user.id,
            repost_of_id=original.id,
            html=clean_html(payload.html),
            status=PostStatus.PUBLISHED,
            published_at=datetime.now(UTC),
        )

        created = await self.posts.add(repost)
        await self.posts.refresh_reposts(original.id)
        await self.notify.execute(
            Notification(
                user_id=original.author_id,
                actor_id=user.id,
                kind=NotificationKind.REPOST,
                post_id=original.id,
            )
        )

        return created
