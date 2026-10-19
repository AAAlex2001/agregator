"""Форма поста: текст, файлы, где публиковать — проверка и перенос в пост."""

from datetime import UTC, datetime

from app.poster.channels.models import PosterChannel
from app.poster.channels.services.repo import ChannelRepository
from app.poster.delivery.models import DeliveryStatus, PostDelivery
from app.poster.delivery.options import TelegramOptions
from app.poster.delivery.services.telegram_markup import length_limit, telegram_length, to_telegram
from app.poster.media.models import PostMedia
from app.poster.media.services.repo import PostMediaRepository
from app.poster.publications.models import Post, PostStatus
from app.poster.publications.schemas import PostSaveSchema
from app.poster.publications.services.exceptions import (
    ButtonsInAlbumError,
    ChannelUnavailableError,
    EmptyPostError,
    NoPublicationTargetError,
    PostMediaUnavailableError,
    ReplyTargetError,
    ScheduleInPastError,
    TelegramTextTooLongError,
)
from app.poster.publications.services.repo import PostRepository
from app.poster.publications.services.text import check_text_length, clean_html, plain_text


def check_telegram_length(html: str, media_count: int) -> None:
    """Текст для Telegram не длиннее сообщения или подписи к медиа."""

    length = telegram_length(to_telegram(html))
    limit = length_limit(media_count)

    if length > limit:
        raise TelegramTextTooLongError(f"Для Telegram текст длиннее лимита: {length} из {limit} символов")


def check_buttons(options: TelegramOptions, media_count: int) -> None:
    """Кнопки Telegram ставит только под одно сообщение — у альбома их быть не может."""

    if options.buttons and media_count > 1:
        raise ButtonsInAlbumError


def check_schedule(scheduled_at: datetime | None, now: datetime) -> None:
    """Время отложенной публикации ещё не наступило."""

    if scheduled_at is None or scheduled_at <= now:
        raise ScheduleInPastError


def next_status(post: Post, payload: PostSaveSchema) -> str:
    """Скрытый остаётся скрытым, вышедший пост не откладывается, со временем — отложенный."""

    if post.status == PostStatus.HIDDEN:
        return PostStatus.HIDDEN

    if payload.draft:
        return PostStatus.DRAFT

    if post.status == PostStatus.PUBLISHED or payload.scheduled_at is None:
        return PostStatus.PUBLISHED

    return PostStatus.SCHEDULED


def has_sent_messages(post: Post) -> bool:
    """Пост уже вышел хотя бы в одном канале."""

    return any(delivery.status == DeliveryStatus.SENT for delivery in post.deliveries)


def sync_deliveries(post: Post, channels: list[PosterChannel]) -> None:
    """Каналы поста как в форме. Уже отправленные остаются: вышедший пост не отзывается."""

    chosen = {channel.id for channel in channels}
    kept = [
        delivery
        for delivery in post.deliveries
        if delivery.status != DeliveryStatus.PENDING or delivery.channel_id in chosen
    ]
    existing = {delivery.channel_id for delivery in kept}
    added = [
        PostDelivery(channel_id=channel.id, channel=channel)
        for channel in channels
        if channel.id not in existing
    ]

    post.deliveries = [*kept, *added]


class PostForm:
    """Записывает форму в пост: текст, файлы по порядку, сайт, каналы и статус."""

    def __init__(
        self,
        media: PostMediaRepository,
        channels: ChannelRepository,
        posts: PostRepository,
    ) -> None:
        self.media = media
        self.channels = channels
        self.posts = posts

    async def attachable_media(
        self,
        owner_id: int,
        media_ids: list[int],
        post_id: int | None,
    ) -> list[PostMedia]:
        """Файлы в порядке формы. Чужой или занятый другим постом — PostMediaUnavailableError."""

        unique_ids = list(dict.fromkeys(media_ids))
        files = await self.media.list_attachable(owner_id, unique_ids, post_id)
        if len(files) != len(unique_ids):
            raise PostMediaUnavailableError

        by_id = {item.id: item for item in files}

        return [by_id[media_id] for media_id in unique_ids]

    async def ready_channels(self, owner_id: int, channel_ids: list[int]) -> list[PosterChannel]:
        """Свои каналы, куда бот может публиковать. Хоть один не такой — ChannelUnavailableError."""

        unique_ids = list(dict.fromkeys(channel_ids))
        if not unique_ids:
            return []

        channels = await self.channels.list_ready(owner_id, unique_ids)
        if len(channels) != len(unique_ids):
            raise ChannelUnavailableError

        return channels

    async def reply_target(self, owner_id: int, post: Post, reply_to_id: int | None) -> int | None:
        """Свой опубликованный пост, на который отвечает этот. Чужой или сам этот — ReplyTargetError."""

        if reply_to_id is None:
            return None

        target = await self.posts.get_by_id(reply_to_id)
        if target is None or target.id == post.id:
            raise ReplyTargetError

        if target.author_id != owner_id or target.status != PostStatus.PUBLISHED:
            raise ReplyTargetError

        return target.id

    async def fill(self, post: Post, owner_id: int, payload: PostSaveSchema) -> None:
        """Пустой пост — EmptyPostError. Скрытый модератором пост остаётся скрытым."""

        if not payload.on_site and not payload.channel_ids:
            raise NoPublicationTargetError

        html = clean_html(payload.html)
        check_text_length(html)

        media = await self.attachable_media(owner_id, payload.media_ids, post.id)
        if not plain_text(html) and not media and payload.telegram.poll is None:
            raise EmptyPostError

        channels = await self.ready_channels(owner_id, payload.channel_ids)
        reply_to_id = await self.reply_target(owner_id, post, payload.reply_to_id)
        if channels or has_sent_messages(post):
            check_telegram_length(html, len(media))
            check_buttons(payload.telegram, len(media))

        now = datetime.now(UTC)
        status = next_status(post, payload)
        if status == PostStatus.SCHEDULED:
            check_schedule(payload.scheduled_at, now)

        for position, item in enumerate(media):
            item.sort_order = position

        post.html = html
        post.media = media
        post.on_site = payload.on_site
        post.telegram = payload.telegram.model_dump(mode="json")
        post.scheduled_at = payload.scheduled_at if status == PostStatus.SCHEDULED else None
        post.reply_to_id = reply_to_id
        post.status = status
        post.updated_at = now
        sync_deliveries(post, channels)

        if post.status == PostStatus.PUBLISHED and post.published_at is None:
            post.published_at = now
