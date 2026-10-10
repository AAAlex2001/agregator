"Use case: list related articles."

from schemas.article import ArticleListItemDto
from services.articles.repository import ArticleRepository
from services.articles.use_cases.list_articles import build_list_item


class ListRelatedArticlesUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."

    def __init__(self, repo: ArticleRepository) -> None:
        self.repo = repo

    async def execute(self, slug: str, limit: int) -> list[ArticleListItemDto]:
        "Запускает основной сценарий use case."
        current = await self.repo.get_published_by_slug(slug)
        if current is None:
            return []
        rows = await self.repo.list_related(
            kind=current.kind, exclude_id=current.id, limit=limit, direction=current.direction
        )
        return [build_list_item(row) for row in rows]
