"""Репост публикации."""

from datetime import UTC, datetime

from app.poster.notifications import ActivityNotifier
from app.poster.publications.models import Post, PostStatus
from app.poster.publications.services.repo import PostRepository
from app.poster.publications.services.text import check_text_length, clean_html
from app.poster.reposts.services.repo import RepostRepository
from models.account import Account


class CreateRepostUseCase:
    """Репост публикуется сразу: просто или с комментарием. Репост репоста ведёт на оригинал."""

    def __init__(
        self,
        posts: PostRepository,
        reposts: RepostRepository,
        notify: ActivityNotifier,
    ) -> None:
        self.posts = posts
        self.reposts = reposts
        self.notify = notify

    async def execute(self, user: Account, post: Post, html: str) -> Post:
        """У оригинала пересчитываются репосты, его автору уходит уведомление."""

        comment = clean_html(html)
        check_text_length(comment)

        original = post.repost_of or post
        repost = Post(
            author_id=user.id,
            repost_of_id=original.id,
            html=comment,
            status=PostStatus.PUBLISHED,
            published_at=datetime.now(UTC),
        )
        created = await self.posts.add(repost)

        await self.reposts.refresh_count(original.id)
        await self.notify.execute(original.author_id, user, "repost", post_id=original.id)

        return created
