from datetime import UTC, datetime

from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.poster.channels.repository import ChannelRepository
from src.poster.delivery.repository import DeliveryRepository
from src.poster.delivery.usecases.edit_sent_messages import EditSentMessagesUseCase
from src.poster.posts.checks import (
    check_fits_telegram,
    check_not_empty,
    check_reply_target,
    check_target,
    choose_status,
    load_channels,
    load_media,
)
from src.poster.posts.exceptions import (
    PostNotFoundError,
    RepostNotEditableError,
    SentMediaChangedError,
)
from src.poster.posts.models import PostStatus
from src.poster.posts.repository import MediaRepository, PostRepository
from src.poster.posts.schemas import PostResponse, SavePostRequest, author_ids
from src.poster.posts.text import check_text_length, clean_html


class UpdatePostUseCase:
    """Правка своего поста."""

    def __init__(
        self,
        posts: PostRepository,
        media: MediaRepository,
        channels: ChannelRepository,
        deliveries: DeliveryRepository,
        edit_sent_messages: EditSentMessagesUseCase,
        accounts: AccountRepository,
    ) -> None:
        """Принимает посты, файлы, каналы, доставки, правку сообщений в Telegram и аккаунты."""
        self.posts = posts
        self.media = media
        self.channels = channels
        self.deliveries = deliveries
        self.edit_sent_messages = edit_sent_messages
        self.accounts = accounts

    async def execute(self, *, user: Account, post_id: int, data: SavePostRequest) -> PostResponse:
        """Сохраняет новую версию поста и правит её в каналах, куда пост уже вышел."""
        now = datetime.now(UTC)
        post = await self.posts.get_for_author(post_id, user.id)

        if post is None:
            raise PostNotFoundError()

        if post.repost_of_id is not None:
            raise RepostNotEditableError()

        check_target(data)

        html = clean_html(data.html)
        check_text_length(html)

        media = await load_media(self.media, user.id, data.media_ids, post.id)
        check_not_empty(html, media, data.telegram)

        channels = await load_channels(self.channels, user.id, data.channel_ids)

        sent_deliveries = await self.deliveries.list_sent(post.id)
        old_media_ids = [item.id for item in post.media]

        if sent_deliveries and data.media_ids != old_media_ids:
            raise SentMediaChangedError()

        if channels or sent_deliveries:
            check_fits_telegram(html, media, data.telegram)

        await check_reply_target(self.posts, user.id, data.reply_to_id, post.id)
        status = choose_status(post.status, data, now)

        for position, item in enumerate(media):
            item.sort_order = position

        post.html = html
        post.media = media
        post.status = status
        post.on_site = data.on_site
        post.telegram = data.telegram.model_dump(mode="json")
        post.scheduled_at = data.scheduled_at if status == PostStatus.SCHEDULED else None
        post.reply_to_id = data.reply_to_id
        post.updated_at = now

        if status == PostStatus.PUBLISHED and post.published_at is None:
            post.published_at = now

        await self.posts.save()
        await self.deliveries.delete_pending_except(post.id, data.channel_ids)
        await self.deliveries.add_missing(post.id, data.channel_ids)

        if sent_deliveries:
            await self.edit_sent_messages.execute(post=post)

        post = await self.posts.reload(post)
        authors = await self.accounts.list_by_ids(author_ids([post]))

        return PostResponse.from_post(post, authors)
