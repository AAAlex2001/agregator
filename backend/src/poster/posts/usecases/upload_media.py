from fastapi import UploadFile

from src.accounts.models import Account
from src.poster.posts.exceptions import TooManyUploadsError
from src.poster.posts.models import PostMedia
from src.poster.posts.repository import MediaRepository
from src.poster.posts.schemas import MediaResponse
from src.poster.posts.storage import MediaStorage

MAX_FREE_MEDIA = 30


class UploadMediaUseCase:
    """Загрузка фото или видео в редактор поста."""

    def __init__(self, media: MediaRepository, storage: MediaStorage) -> None:
        """Принимает файлы в базе и файлы на диске."""
        self.media = media
        self.storage = storage

    async def execute(self, *, user: Account, file: UploadFile) -> MediaResponse:
        """Сохраняет фото или видео до сохранения поста, чтобы автор видел превью."""
        if await self.media.count_free(user.id) >= MAX_FREE_MEDIA:
            raise TooManyUploadsError()

        kind, path = await self.storage.save(file)
        media = PostMedia(owner_id=user.id, kind=kind, path=path)
        await self.media.add(media)

        return MediaResponse.from_media(media)
