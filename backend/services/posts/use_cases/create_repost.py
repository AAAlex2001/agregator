"""Сценарий репоста."""

from datetime import UTC, datetime

from models.account import Account
from models.posts import Post, PostStatus
from schemas.posts import RepostSaveSchema
from services.notifications.use_cases.create_post_activity_notification import (
    CreatePostActivityNotificationUseCase,
)
from services.posts.html import check_text_length, clean_html
from services.posts.repo import PostRepository


class CreateRepostUseCase:
    """Репост сразу публикуется: просто или с комментарием. Репост репоста ведёт на оригинал."""

    def __init__(self, posts: PostRepository, notify: CreatePostActivityNotificationUseCase) -> None:
        self.posts = posts
        self.notify = notify

    async def execute(self, user: Account, post: Post, payload: RepostSaveSchema) -> Post:
        """Опубликованный репост. У оригинала пересчитываются репосты, автору уходит уведомление."""

        html = clean_html(payload.html)
        check_text_length(html)
        original = post.repost_of or post
        repost = Post(
            author_id=user.id,
            repost_of_id=original.id,
            html=html,
            status=PostStatus.PUBLISHED,
            published_at=datetime.now(UTC),
        )
        created = await self.posts.add(repost)
        await self.posts.refresh_reposts(original.id)
        await self.notify.execute(original.author_id, user, "repost", post_id=original.id)
        return created
