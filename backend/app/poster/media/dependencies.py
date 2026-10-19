"""Файлы постов: репозиторий и фабрики сценариев."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.poster.media.services.repo import PostMediaRepository
from app.poster.media.services.usecases.delete_media import DeleteMediaUseCase
from app.poster.media.services.usecases.upload_media import UploadMediaUseCase


def get_post_media_repository(db: AsyncSession = Depends(get_db)) -> PostMediaRepository:
    """Репозиторий файлов с сессией текущего запроса."""

    return PostMediaRepository(db)


def get_upload_media_usecase(
    media: PostMediaRepository = Depends(get_post_media_repository),
) -> UploadMediaUseCase:
    """Сценарий загрузки файла."""

    return UploadMediaUseCase(media)


def get_delete_media_usecase(
    media: PostMediaRepository = Depends(get_post_media_repository),
) -> DeleteMediaUseCase:
    """Сценарий удаления свободного файла."""

    return DeleteMediaUseCase(media)
