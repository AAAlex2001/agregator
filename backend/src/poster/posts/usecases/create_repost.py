from datetime import UTC, datetime

from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.notifications.usecases.notify_post_activity import NotifyPostActivityUseCase
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.models import Post, PostStatus
from src.poster.posts.repository import PostRepository
from src.poster.posts.schemas import PostResponse, RepostRequest, author_ids
from src.poster.posts.text import check_text_length, clean_html


class CreateRepostUseCase:
    """Репост чужого или своего поста к себе с комментарием."""

    def __init__(
        self,
        posts: PostRepository,
        accounts: AccountRepository,
        notify: NotifyPostActivityUseCase,
    ) -> None:
        """Принимает посты, аккаунты и отправку уведомлений."""
        self.posts = posts
        self.accounts = accounts
        self.notify = notify

    async def execute(self, *, user: Account, post_id: int, data: RepostRequest) -> PostResponse:
        """Создаёт и сразу публикует репост, уведомляет автора оригинала."""
        original = await self.posts.get(post_id)

        if original is None or original.status != PostStatus.PUBLISHED or not original.on_site:
            raise PostNotFoundError()

        if original.repost_of is not None:
            original = original.repost_of

        html = clean_html(data.html)
        check_text_length(html)

        repost = Post(
            author_id=user.id,
            repost_of_id=original.id,
            html=html,
            status=PostStatus.PUBLISHED,
            published_at=datetime.now(UTC),
        )
        await self.posts.add(repost)
        await self.posts.change_reposts_count(original.id, 1)
        await self.notify.execute(
            recipient_id=original.author_id,
            actor=user,
            kind="repost",
            post_id=original.id,
        )

        repost = await self.posts.reload(repost)
        authors = await self.accounts.list_by_ids(author_ids([repost]))

        return PostResponse.from_post(repost, authors)
