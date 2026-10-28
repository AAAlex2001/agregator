from src.core.database import SessionLocal
from src.poster.posts.repository import MediaRepository, PostRepository
from src.poster.posts.storage import MediaStorage
from src.poster.posts.usecases.delete_unused_media import DeleteUnusedMediaUseCase
from src.poster.posts.usecases.publish_scheduled_posts import PublishScheduledPostsUseCase


async def publish_scheduled_posts() -> None:
    """Публикует отложенные посты, время которых наступило. Worker запускает её каждые 3 секунды."""
    async with SessionLocal() as db:
        await PublishScheduledPostsUseCase(PostRepository(db)).execute()
        await db.commit()


async def delete_unused_media() -> None:
    """Удаляет фото и видео, которые загрузили, но так и не прикрепили к посту. Раз в час."""
    async with SessionLocal() as db:
        await DeleteUnusedMediaUseCase(MediaRepository(db), MediaStorage()).execute()
        await db.commit()
