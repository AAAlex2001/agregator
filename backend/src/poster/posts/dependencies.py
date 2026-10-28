from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.accounts.repository import AccountRepository
from src.core.database import get_db
from src.core.telegram import TelegramClient, get_telegram
from src.notifications.repository import NotificationRepository
from src.notifications.usecases.notify_post_activity import NotifyPostActivityUseCase
from src.poster.channels.repository import ChannelRepository
from src.poster.delivery.publisher import TelegramPublisher
from src.poster.delivery.repository import DeliveryRepository
from src.poster.delivery.usecases.edit_sent_messages import EditSentMessagesUseCase
from src.poster.delivery.usecases.withdraw_messages import WithdrawMessagesUseCase
from src.poster.posts.repository import MediaRepository, PostRepository
from src.poster.posts.storage import MediaStorage
from src.poster.posts.usecases.create_post import CreatePostUseCase
from src.poster.posts.usecases.create_repost import CreateRepostUseCase
from src.poster.posts.usecases.delete_media import DeleteMediaUseCase
from src.poster.posts.usecases.delete_post import DeletePostUseCase
from src.poster.posts.usecases.delete_post_by_moderator import DeletePostByModeratorUseCase
from src.poster.posts.usecases.get_post_for_moderation import GetPostForModerationUseCase
from src.poster.posts.usecases.list_posts_for_moderation import ListPostsForModerationUseCase
from src.poster.posts.usecases.preview_telegram import PreviewTelegramUseCase
from src.poster.posts.usecases.update_post import UpdatePostUseCase
from src.poster.posts.usecases.upload_media import UploadMediaUseCase


def get_create_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CreatePostUseCase:
    """Собирает сценарий создания поста."""
    return CreatePostUseCase(
        PostRepository(db),
        MediaRepository(db),
        ChannelRepository(db),
        DeliveryRepository(db),
        AccountRepository(db),
    )


def get_update_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    telegram: Annotated[TelegramClient, Depends(get_telegram)],
) -> UpdatePostUseCase:
    """Собирает сценарий правки поста."""
    edit_sent_messages = EditSentMessagesUseCase(DeliveryRepository(db), TelegramPublisher(telegram))

    return UpdatePostUseCase(
        PostRepository(db),
        MediaRepository(db),
        ChannelRepository(db),
        DeliveryRepository(db),
        edit_sent_messages,
        AccountRepository(db),
    )


def get_delete_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    telegram: Annotated[TelegramClient, Depends(get_telegram)],
) -> DeletePostUseCase:
    """Собирает сценарий удаления поста."""
    withdraw_messages = WithdrawMessagesUseCase(DeliveryRepository(db), TelegramPublisher(telegram))

    return DeletePostUseCase(PostRepository(db), MediaStorage(), withdraw_messages)


def get_create_repost_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CreateRepostUseCase:
    """Собирает сценарий репоста."""
    notify = NotifyPostActivityUseCase(NotificationRepository(db), AccountRepository(db))

    return CreateRepostUseCase(PostRepository(db), AccountRepository(db), notify)


def get_upload_media_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UploadMediaUseCase:
    """Собирает сценарий загрузки фото или видео."""
    return UploadMediaUseCase(MediaRepository(db), MediaStorage())


def get_delete_media_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DeleteMediaUseCase:
    """Собирает сценарий удаления загруженного файла."""
    return DeleteMediaUseCase(MediaRepository(db), MediaStorage())


def get_preview_telegram_usecase() -> PreviewTelegramUseCase:
    """Собирает сценарий предпросмотра поста в Telegram."""
    return PreviewTelegramUseCase()


def get_list_posts_for_moderation_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ListPostsForModerationUseCase:
    """Собирает сценарий списка постов для модератора."""
    return ListPostsForModerationUseCase(PostRepository(db), AccountRepository(db))


def get_get_post_for_moderation_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> GetPostForModerationUseCase:
    """Собирает сценарий просмотра поста модератором."""
    return GetPostForModerationUseCase(PostRepository(db), AccountRepository(db))


def get_delete_post_by_moderator_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DeletePostByModeratorUseCase:
    """Собирает сценарий удаления поста модератором."""
    return DeletePostByModeratorUseCase(PostRepository(db), MediaStorage())
