
"Use case: list articles."
from models.article import ArticleKind
from schemas.article import ArticleKindDto, ArticleListDto, ArticleListItemDto
from services.articles.repository import ArticleRepository

KIND_FROM_DTO = {"news": ArticleKind.NEWS, "blog": ArticleKind.BLOG}
KIND_TO_DTO: dict[ArticleKind, ArticleKindDto] = {
    ArticleKind.NEWS: "news",
    ArticleKind.BLOG: "blog",
}


class ListArticlesUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: ArticleRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        kind: ArticleKindDto,
        skip: int,
        limit: int,
        tag: str | None,
    ) -> ArticleListDto:
        "Запускает основной сценарий use case."
        rows, has_more = await self.repo.list_published(
            kind=KIND_FROM_DTO[kind], skip=skip, limit=limit, tag=tag
        )
        items = [
            ArticleListItemDto(
                id=row.id,
                kind=KIND_TO_DTO[row.kind],
                slug=row.slug,
                title=row.title,
                excerpt=row.excerpt,
                cover_image=row.cover_image,
                tags=list(row.tags or []),
                published_at=row.published_at,
            )
            for row in rows
        ]
        return ArticleListDto(items=items, has_more=has_more)
