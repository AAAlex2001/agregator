"""Публикации: репозиторий, фабрики сценариев и пост по id из пути.

Чужое и неопубликованное выглядит как несуществующее — 404.
"""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.sessions.dependencies import get_current_user, require_user
from app.core.database import get_db
from app.core.telegram import TelegramApi, get_telegram_api
from app.poster.channels.dependencies import get_channel_repository
from app.poster.channels.services.repo import ChannelRepository
from app.poster.delivery.services.publisher import TelegramPublisher
from app.poster.delivery.services.usecases.delete_messages import DeleteMessagesUseCase
from app.poster.delivery.services.usecases.edit_messages import EditMessagesUseCase
from app.poster.media.dependencies import get_post_media_repository
from app.poster.media.services.repo import PostMediaRepository
from app.poster.publications.models import Post, PostStatus
from app.poster.publications.services.exceptions import PostNotFoundError
from app.poster.publications.services.post_form import PostForm
from app.poster.publications.services.repo import PostRepository
from app.poster.publications.services.usecases.create_post import CreatePostUseCase
from app.poster.publications.services.usecases.delete_post import DeletePostUseCase
from app.poster.publications.services.usecases.update_post import UpdatePostUseCase
from app.poster.reposts.services.repo import RepostRepository
from models.account import Account


def get_post_repository(db: AsyncSession = Depends(get_db)) -> PostRepository:
    """Репозиторий постов с сессией текущего запроса."""

    return PostRepository(db)


def get_post_form(
    media: PostMediaRepository = Depends(get_post_media_repository),
    channels: ChannelRepository = Depends(get_channel_repository),
    posts: PostRepository = Depends(get_post_repository),
) -> PostForm:
    """Форма поста: текст, файлы, сайт, каналы и пост, на который отвечаем."""

    return PostForm(media, channels, posts)


def get_telegram_publisher(api: TelegramApi = Depends(get_telegram_api)) -> TelegramPublisher:
    """Отправка, правка и удаление поста в Telegram."""

    return TelegramPublisher(api)


def get_create_post_usecase(
    posts: PostRepository = Depends(get_post_repository),
    form: PostForm = Depends(get_post_form),
) -> CreatePostUseCase:
    """Сценарий нового поста."""

    return CreatePostUseCase(posts, form)


def get_update_post_usecase(
    posts: PostRepository = Depends(get_post_repository),
    form: PostForm = Depends(get_post_form),
    publisher: TelegramPublisher = Depends(get_telegram_publisher),
) -> UpdatePostUseCase:
    """Сценарий правки поста."""

    return UpdatePostUseCase(posts, form, EditMessagesUseCase(publisher))


def get_delete_post_usecase(
    db: AsyncSession = Depends(get_db),
    posts: PostRepository = Depends(get_post_repository),
    publisher: TelegramPublisher = Depends(get_telegram_publisher),
) -> DeletePostUseCase:
    """Сценарий удаления поста."""

    return DeletePostUseCase(posts, RepostRepository(db), DeleteMessagesUseCase(publisher))


async def get_post(post_id: int, posts: PostRepository = Depends(get_post_repository)) -> Post:
    """Пост любого статуса — для модератора и проверок ниже."""

    post = await posts.get_by_id(post_id)
    if post is None:
        raise PostNotFoundError

    return post


def is_on_site(post: Post) -> bool:
    """Пост опубликован и показан на сайте."""

    return post.status == PostStatus.PUBLISHED and post.on_site


def ensure_visible(post: Post, user: Account | None) -> None:
    """Показать можно вышедший на сайте или свой пост, а репост — только с оригиналом на сайте."""

    if post.repost_of is not None and not is_on_site(post.repost_of):
        raise PostNotFoundError

    is_own = user is not None and post.author_id == user.id
    if not is_on_site(post) and not is_own:
        raise PostNotFoundError


async def get_visible_post(
    post: Post = Depends(get_post),
    user: Account | None = Depends(get_current_user),
) -> Post:
    """Пост, который можно показать тому, кто смотрит."""

    ensure_visible(post, user)

    return post


async def get_published_post(post: Post = Depends(get_visible_post)) -> Post:
    """Пост на сайте: на него можно реагировать."""

    if not is_on_site(post):
        raise PostNotFoundError

    return post


async def get_own_post(
    post: Post = Depends(get_post),
    user: Account = Depends(require_user),
) -> Post:
    """Свой пост."""

    if post.author_id != user.id:
        raise PostNotFoundError

    return post
