"""Удаление загруженного, но не привязанного файла."""

from app.poster.media.services.exceptions import PostMediaNotFoundError
from app.poster.media.services.repo import PostMediaRepository
from app.poster.media.services.storage import remove_file
from models.account import Account


class DeleteMediaUseCase:
    """Удаляет запись о файле, потом сам файл."""

    def __init__(self, media: PostMediaRepository) -> None:
        self.media = media

    async def execute(self, user: Account, media_id: int) -> None:
        """Чужой или уже привязанный к посту — PostMediaNotFoundError."""

        item = await self.media.get_for_update(media_id)
        if item is None or item.owner_id != user.id or item.post_id is not None:
            raise PostMediaNotFoundError

        await self.media.delete(item)
        remove_file(item.path)
