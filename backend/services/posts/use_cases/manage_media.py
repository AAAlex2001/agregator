"""Сценарии файлов к посту до публикации: загрузить и удалить."""

from fastapi import UploadFile
from sqlalchemy.exc import SQLAlchemyError

from models.account import Account
from models.posts import MediaKind, PostMedia
from services.posts.exceptions import PostMediaNotFoundError, TooManyPostMediaError
from services.posts.repo import PostMediaRepository
from services.posts.uploads import MEGABYTE, remove_file, save_image, save_video

MAX_FREE_MEDIA = 30
MAX_MEDIA_SIZE_BYTES = 50 * MEGABYTE


class UploadPostMediaUseCase:
    """Сохранить фото или видео на сервер. К посту файл привяжется при публикации."""

    def __init__(self, media: PostMediaRepository) -> None:
        self.media = media

    async def execute(self, user: Account, file: UploadFile, kind: MediaKind) -> PostMedia:
        """Вернуть загруженный файл. Бросает UploadError и TooManyPostMediaError."""

        if await self.media.count_free(user.id) >= MAX_FREE_MEDIA:
            raise TooManyPostMediaError(user.id)

        if kind == MediaKind.VIDEO:
            path = await save_video(file, MAX_MEDIA_SIZE_BYTES)
        else:
            path = await save_image(file, MAX_MEDIA_SIZE_BYTES)

        try:
            return await self.media.add(PostMedia(owner_id=user.id, kind=kind, path=path))
        except SQLAlchemyError:
            remove_file(path)
            raise


class DeletePostMediaUseCase:
    """Удалить загруженный, но ещё не опубликованный файл."""

    def __init__(self, media: PostMediaRepository) -> None:
        self.media = media

    async def execute(self, user: Account, media_id: int) -> None:
        """Удалить файл из базы и с диска. Чужой или привязанный — PostMediaNotFoundError."""

        item = await self.media.get_for_update(media_id)
        if item is None or item.owner_id != user.id or item.post_id is not None:
            raise PostMediaNotFoundError(media_id)

        path = item.path
        await self.media.delete(item)
        remove_file(path)
