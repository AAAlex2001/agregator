from src.accounts.models import Account
from src.poster.posts.exceptions import MediaNotOwnedError
from src.poster.posts.repository import MediaRepository
from src.poster.posts.storage import MediaStorage


class DeleteMediaUseCase:
    """Автор убрал загруженный файл из редактора, пока пост ещё не сохранён."""

    def __init__(self, media: MediaRepository, storage: MediaStorage) -> None:
        """Принимает файлы в базе и файлы на диске."""
        self.media = media
        self.storage = storage

    async def execute(self, *, user: Account, media_id: int) -> None:
        """Удаляет файл. Файл, который уже прикреплён к посту, так удалить нельзя."""
        media = await self.media.get_free(media_id, user.id)

        if media is None:
            raise MediaNotOwnedError()

        path = media.path
        await self.media.delete(media)
        self.storage.delete([path])
