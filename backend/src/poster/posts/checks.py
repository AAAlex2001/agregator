from datetime import datetime

from src.poster.channels.models import PosterChannel
from src.poster.channels.repository import ChannelRepository
from src.poster.delivery.schemas import TelegramOptions
from src.poster.delivery.telegram_text import length_limit, telegram_length, to_telegram_html
from src.poster.posts.exceptions import (
    ButtonsInAlbumError,
    ChannelUnavailableError,
    EmptyPostError,
    MediaNotFoundError,
    NoPublicationTargetError,
    ReplyTargetError,
    ScheduleInPastError,
    TelegramTextTooLongError,
)
from src.poster.posts.models import PostMedia, PostStatus
from src.poster.posts.repository import MediaRepository, PostRepository
from src.poster.posts.schemas import SavePostRequest
from src.poster.posts.text import plain_text


def check_target(data: SavePostRequest) -> None:
    """Пост должен куда-то выйти: на сайт или хотя бы в один канал."""
    if not data.on_site and not data.channel_ids:
        raise NoPublicationTargetError()


def check_not_empty(html: str, media: list[PostMedia], options: TelegramOptions) -> None:
    """В посте должно быть хоть что-то: текст, фото или видео, опрос."""
    if not plain_text(html) and not media and options.poll is None:
        raise EmptyPostError()


def check_fits_telegram(html: str, media: list[PostMedia], options: TelegramOptions) -> None:
    """Проверяет, что текст влезает в лимит Telegram и кнопки не стоят у альбома."""
    length = telegram_length(to_telegram_html(html))
    limit = length_limit(len(media))

    if length > limit:
        raise TelegramTextTooLongError(f"Для Telegram текст длиннее {limit} символов: сейчас {length}")

    if options.buttons and len(media) > 1:
        raise ButtonsInAlbumError()


async def check_reply_target(
    posts: PostRepository,
    author_id: int,
    reply_to_id: int | None,
    post_id: int | None,
) -> None:
    """Ответить в Telegram можно только на свой другой пост, который уже опубликован."""
    if reply_to_id is None:
        return

    target = await posts.get(reply_to_id)

    if target is None or target.id == post_id:
        raise ReplyTargetError()

    if target.author_id != author_id or target.status != PostStatus.PUBLISHED:
        raise ReplyTargetError()


def choose_status(current_status: str, data: SavePostRequest, now: datetime) -> PostStatus:
    """Решает, каким станет пост после сохранения: черновик, отложенный или опубликован."""
    if current_status == PostStatus.HIDDEN:
        return PostStatus.HIDDEN

    if data.draft:
        return PostStatus.DRAFT

    if current_status == PostStatus.PUBLISHED or data.scheduled_at is None:
        return PostStatus.PUBLISHED

    if data.scheduled_at <= now:
        raise ScheduleInPastError()

    return PostStatus.SCHEDULED


async def load_media(
    media: MediaRepository,
    owner_id: int,
    media_ids: list[int],
    post_id: int | None,
) -> list[PostMedia]:
    """Достаёт файлы из формы в том же порядке. Если какого-то нет или он чужой — ошибка."""
    found_media = await media.list_free(owner_id, media_ids, post_id)

    if len(found_media) != len(media_ids):
        raise MediaNotFoundError()

    found_media.sort(key=lambda item: media_ids.index(item.id))

    return found_media


async def load_channels(
    channels: ChannelRepository,
    owner_id: int,
    channel_ids: list[int],
) -> list[PosterChannel]:
    """Достаёт каналы из формы. Если в какой-то из них бот не может публиковать — ошибка."""
    found_channels = await channels.list_ready(owner_id, channel_ids)

    if len(found_channels) != len(channel_ids):
        raise ChannelUnavailableError()

    return found_channels
