"""Фото и видео для будущего поста."""

from fastapi import APIRouter, Depends, UploadFile, status

from app.auth.sessions.dependencies import require_user
from app.poster.media.dependencies import get_delete_media_usecase, get_upload_media_usecase
from app.poster.media.schemas import PostMediaSchema
from app.poster.media.services.usecases.delete_media import DeleteMediaUseCase
from app.poster.media.services.usecases.upload_media import UploadMediaUseCase
from models.account import Account

router = APIRouter()


@router.post("/media", status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile,
    user: Account = Depends(require_user),
    usecase: UploadMediaUseCase = Depends(get_upload_media_usecase),
) -> PostMediaSchema:
    """Загрузить фото или видео. Его id передаётся при сохранении поста."""

    media = await usecase.execute(user=user, file=file)

    return PostMediaSchema.model_validate(media)


@router.delete("/media/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(
    media_id: int,
    user: Account = Depends(require_user),
    usecase: DeleteMediaUseCase = Depends(get_delete_media_usecase),
) -> None:
    """Удалить загруженный файл, пока он не привязан к посту."""

    await usecase.execute(user=user, media_id=media_id)
