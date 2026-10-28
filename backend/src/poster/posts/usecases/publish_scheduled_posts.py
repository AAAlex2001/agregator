from datetime import UTC, datetime

from src.poster.posts.repository import PostRepository


class PublishScheduledPostsUseCase:
    """Выпуск отложенных постов. Его запускает worker каждые несколько секунд."""

    def __init__(self, posts: PostRepository) -> None:
        """Принимает репозиторий постов."""
        self.posts = posts

    async def execute(self) -> None:
        """Публикует посты, время которых наступило. В каналы их потом отправит доставка."""
        await self.posts.publish_scheduled(datetime.now(UTC))
