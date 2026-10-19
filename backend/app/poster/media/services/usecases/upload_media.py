"""Загрузка фото или видео для будущего поста."""

from fastapi import UploadFile

from app.poster.media.models import MediaKind, PostMedia
from app.poster.media.services.exceptions import TooManyPostMediaError
from app.poster.media.services.repo import PostMediaRepository
from app.poster.media.services.storage import (
    MEGABYTE,
    is_video_header,
    remove_file,
    save_image,
    save_video,
)
from models.account import Account

MAX_FREE_MEDIA = 30
MAX_MEDIA_SIZE = 50 * MEGABYTE


class UploadMediaUseCase:
    """Сохраняет файл на сервер. К посту он привяжется при сохранении поста."""

    def __init__(self, media: PostMediaRepository) -> None:
        self.media = media

    async def execute(self, user: Account, file: UploadFile) -> PostMedia:
        """Вид файла определяется по содержимому. Слишком много свободных — TooManyPostMediaError."""

        if await self.media.count_free(user.id) >= MAX_FREE_MEDIA:
            raise TooManyPostMediaError

        head = await file.read(12)
        await file.seek(0)

        if is_video_header(head):
            kind = MediaKind.VIDEO
            path = await save_video(file, MAX_MEDIA_SIZE)
        else:
            kind = MediaKind.PHOTO
            path = await save_image(file, MAX_MEDIA_SIZE)

        try:
            return await self.media.add(PostMedia(owner_id=user.id, kind=kind, path=path))
        except BaseException:
            remove_file(path)
            raise
