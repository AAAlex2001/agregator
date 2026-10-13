"""Сценарии файлов к посту до публикации: загрузить и удалить."""

from fastapi import UploadFile

from models.account import Account
from models.posts import MediaKind, PostMedia
from services.posts.exceptions import PostMediaNotFoundError, TooManyPostMediaError
from services.posts.repo import PostMediaRepository
from services.posts.uploads import MEGABYTE, is_video_header, remove_file, save_image, save_video

MAX_FREE_MEDIA = 30
MAX_MEDIA_SIZE_BYTES = 50 * MEGABYTE


class UploadPostMediaUseCase:
    """Сохраняет фото или видео на сервер. К посту файл привяжется при сохранении поста."""

    def __init__(self, media: PostMediaRepository) -> None:
        self.media = media

    async def execute(self, user: Account, file: UploadFile) -> PostMedia:
        """Загруженный файл. Вид определяется по содержимому, а не по заголовку от клиента."""

        if await self.media.count_free(user.id) >= MAX_FREE_MEDIA:
            raise TooManyPostMediaError()

        head = await file.read(12)
        await file.seek(0)
        kind = MediaKind.VIDEO if is_video_header(head) else MediaKind.PHOTO
        save = save_video if kind == MediaKind.VIDEO else save_image
        path = await save(file, MAX_MEDIA_SIZE_BYTES)

        try:
            return await self.media.add(PostMedia(owner_id=user.id, kind=kind, path=path))
        except BaseException:
            remove_file(path)
            raise


class DeletePostMediaUseCase:
    """Удаляет загруженный, но ещё не привязанный к посту файл."""

    def __init__(self, media: PostMediaRepository) -> None:
        self.media = media

    async def execute(self, user: Account, media_id: int) -> None:
        """Удаляет запись, потом файл. Чужой или привязанный — PostMediaNotFoundError."""

        item = await self.media.get_for_update(media_id)
        if item is None or item.owner_id != user.id or item.post_id is not None:
            raise PostMediaNotFoundError()
        await self.media.delete(item)
        remove_file(item.path)
