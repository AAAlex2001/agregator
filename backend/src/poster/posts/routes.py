from typing import Annotated

from fastapi import APIRouter, Depends, Query, UploadFile, status

from src.accounts.models import Account
from src.auth.sessions.dependencies import require_user
from src.poster.posts.dependencies import (
    get_create_post_usecase,
    get_create_repost_usecase,
    get_delete_media_usecase,
    get_delete_post_usecase,
    get_preview_telegram_usecase,
    get_update_post_usecase,
    get_upload_media_usecase,
)
from src.poster.posts.schemas import (
    MediaResponse,
    PostResponse,
    RepostRequest,
    SavePostRequest,
    TelegramPreviewRequest,
    TelegramPreviewResponse,
)
from src.poster.posts.usecases.create_post import CreatePostUseCase
from src.poster.posts.usecases.create_repost import CreateRepostUseCase
from src.poster.posts.usecases.delete_media import DeleteMediaUseCase
from src.poster.posts.usecases.delete_post import DeletePostUseCase
from src.poster.posts.usecases.preview_telegram import PreviewTelegramUseCase
from src.poster.posts.usecases.update_post import UpdatePostUseCase
from src.poster.posts.usecases.upload_media import UploadMediaUseCase

router = APIRouter(tags=["Посты"])


@router.post("/posts/media", status_code=status.HTTP_201_CREATED, response_model=MediaResponse)
async def upload_media(
    file: UploadFile,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[UploadMediaUseCase, Depends(get_upload_media_usecase)],
) -> MediaResponse:
    """Загружает фото или видео для поста, который сейчас пишет автор."""
    return await usecase.execute(user=user, file=file)


@router.delete("/posts/media/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(
    media_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[DeleteMediaUseCase, Depends(get_delete_media_usecase)],
) -> None:
    """Удаляет загруженный файл, который ещё не прикреплён к посту."""
    await usecase.execute(user=user, media_id=media_id)


@router.post("/posts", status_code=status.HTTP_201_CREATED, response_model=PostResponse)
async def create_post(
    data: SavePostRequest,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[CreatePostUseCase, Depends(get_create_post_usecase)],
) -> PostResponse:
    """Создаёт пост: черновик, отложенный или сразу опубликованный."""
    return await usecase.execute(user=user, data=data)


@router.put("/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    data: SavePostRequest,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[UpdatePostUseCase, Depends(get_update_post_usecase)],
) -> PostResponse:
    """Сохраняет новую версию моего поста."""
    return await usecase.execute(user=user, post_id=post_id, data=data)


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[DeletePostUseCase, Depends(get_delete_post_usecase)],
    from_channels: Annotated[bool, Query()] = False,
) -> None:
    """Удаляет мой пост. from_channels — удалить его и из Telegram-каналов."""
    await usecase.execute(user=user, post_id=post_id, from_channels=from_channels)


@router.post("/posts/{post_id}/repost", status_code=status.HTTP_201_CREATED, response_model=PostResponse)
async def create_repost(
    post_id: int,
    data: RepostRequest,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[CreateRepostUseCase, Depends(get_create_repost_usecase)],
) -> PostResponse:
    """Репостит пост к себе с комментарием."""
    return await usecase.execute(user=user, post_id=post_id, data=data)


@router.post(
    "/poster/telegram-preview",
    response_model=TelegramPreviewResponse,
    dependencies=[Depends(require_user)],
)
async def preview_telegram(
    data: TelegramPreviewRequest,
    usecase: Annotated[PreviewTelegramUseCase, Depends(get_preview_telegram_usecase)],
) -> TelegramPreviewResponse:
    """Показывает, как текст поста будет выглядеть в Telegram и влезает ли он в лимит."""
    return await usecase.execute(data=data)
