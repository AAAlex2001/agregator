from datetime import UTC, datetime, timedelta

from src.poster.posts.repository import MediaRepository
from src.poster.posts.storage import MediaStorage


class DeleteUnusedMediaUseCase:
    """Уборка брошенных файлов: их загрузили в редактор, но пост так и не сохранили."""

    def __init__(self, media: MediaRepository, storage: MediaStorage) -> None:
        """Принимает файлы в базе и файлы на диске."""
        self.media = media
        self.storage = storage

    async def execute(self) -> None:
        """Удаляет файлы без поста старше суток: сутки автор мог дописывать пост."""
        paths = await self.media.delete_unused(datetime.now(UTC) - timedelta(days=1))
        self.storage.delete(paths)
