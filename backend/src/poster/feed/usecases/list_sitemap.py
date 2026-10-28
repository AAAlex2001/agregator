from src.poster.feed.repository import FeedRepository
from src.poster.feed.schemas import SitemapItemResponse


class ListSitemapUseCase:
    """Посты для карты сайта."""

    def __init__(self, feed: FeedRepository) -> None:
        """Принимает ленты."""
        self.feed = feed

    async def execute(self) -> list[SitemapItemResponse]:
        """Возвращает опубликованные посты без репостов: id, автора и дату изменения."""
        rows = await self.feed.list_sitemap()

        return [
            SitemapItemResponse(id=post_id, author_id=author_id, updated_at=updated_at)
            for post_id, author_id, updated_at in rows
        ]
