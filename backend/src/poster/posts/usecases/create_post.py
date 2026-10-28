from datetime import UTC, datetime

from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.poster.channels.repository import ChannelRepository
from src.poster.delivery.repository import DeliveryRepository
from src.poster.posts.checks import (
    check_fits_telegram,
    check_not_empty,
    check_reply_target,
    check_target,
    choose_status,
    load_channels,
    load_media,
)
from src.poster.posts.models import Post, PostStatus
from src.poster.posts.repository import MediaRepository, PostRepository
from src.poster.posts.schemas import PostResponse, SavePostRequest, author_ids
from src.poster.posts.text import check_text_length, clean_html


class CreatePostUseCase:
    """Создание поста из редактора."""

    def __init__(
        self,
        posts: PostRepository,
        media: MediaRepository,
        channels: ChannelRepository,
        deliveries: DeliveryRepository,
        accounts: AccountRepository,
    ) -> None:
        """Принимает посты, файлы, каналы, доставки и аккаунты."""
        self.posts = posts
        self.media = media
        self.channels = channels
        self.deliveries = deliveries
        self.accounts = accounts

    async def execute(self, *, user: Account, data: SavePostRequest) -> PostResponse:
        """Создаёт пост и ставит его в очередь в выбранные каналы."""
        now = datetime.now(UTC)
        check_target(data)

        html = clean_html(data.html)
        check_text_length(html)

        media = await load_media(self.media, user.id, data.media_ids, None)
        check_not_empty(html, media, data.telegram)

        channels = await load_channels(self.channels, user.id, data.channel_ids)

        if channels:
            check_fits_telegram(html, media, data.telegram)

        await check_reply_target(self.posts, user.id, data.reply_to_id, None)
        status = choose_status(PostStatus.DRAFT, data, now)

        for position, item in enumerate(media):
            item.sort_order = position

        post = Post(
            author_id=user.id,
            html=html,
            media=media,
            status=status,
            on_site=data.on_site,
            telegram=data.telegram.model_dump(mode="json"),
            scheduled_at=data.scheduled_at if status == PostStatus.SCHEDULED else None,
            published_at=now if status == PostStatus.PUBLISHED else None,
            reply_to_id=data.reply_to_id,
        )
        await self.posts.add(post)
        await self.deliveries.add_missing(post.id, data.channel_ids)

        post = await self.posts.reload(post)
        authors = await self.accounts.list_by_ids(author_ids([post]))

        return PostResponse.from_post(post, authors)
