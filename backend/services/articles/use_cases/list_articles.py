"Use case: list articles."

from models.article import Article, ArticleKind
from models.order import OrderWorkType
from schemas.article import ArticleKindDto, ArticleListDto, ArticleListItemDto
from services.articles.repository import ArticleRepository

KIND_FROM_DTO = {"news": ArticleKind.NEWS, "blog": ArticleKind.BLOG}
KIND_TO_DTO: dict[ArticleKind, ArticleKindDto] = {
    ArticleKind.NEWS: "news",
    ArticleKind.BLOG: "blog",
}


def build_list_item(row: Article) -> ArticleListItemDto:
    "Карточка статьи для списков, похожих статей и слайдеров."
    return ArticleListItemDto(
        id=row.id,
        kind=KIND_TO_DTO[row.kind],
        direction=row.direction.value if row.direction else None,
        slug=row.slug,
        title=row.title,
        excerpt=row.excerpt,
        cover_image=row.cover_image,
        tg_cover_image=row.tg_cover_image,
        tags=[t.name for t in row.tags],
        published_at=row.published_at,
        likes_count=row.likes_count,
        dislikes_count=row.dislikes_count,
        views_count=row.views_count,
    )


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
        direction: OrderWorkType | None = None,
    ) -> ArticleListDto:
        "Запускает основной сценарий use case."
        rows, has_more = await self.repo.list_published(
            kind=KIND_FROM_DTO[kind], skip=skip, limit=limit, tag=tag, direction=direction
        )
        return ArticleListDto(items=[build_list_item(row) for row in rows], has_more=has_more)
