"Use case: get article by slug."
from fastapi import HTTPException, status

from schemas.article import ArticleDetailDto
from services.articles.repository import ArticleRepository
from services.articles.use_cases.list_articles import KIND_TO_DTO


class GetArticleBySlugUseCase:
    "Сценарий приложения: координирует репозитории и сервисы."
    def __init__(self, repo: ArticleRepository) -> None:
        self.repo = repo

    async def execute(self, slug: str) -> ArticleDetailDto:
        "Запускает основной сценарий use case."
        row = await self.repo.get_published_by_slug(slug)
        if row is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Статья не найдена",
            )
        return ArticleDetailDto(
            id=row.id,
            kind=KIND_TO_DTO[row.kind],
            slug=row.slug,
            title=row.title,
            excerpt=row.excerpt,
            cover_image=row.cover_image,
            tg_cover_image=row.tg_cover_image,
            content_html=row.content_html,
            tags=[t.name for t in row.tags],
            meta_title=row.meta_title,
            meta_description=row.meta_description,
            meta_keywords=row.meta_keywords,
            og_image=row.og_image,
            published_at=row.published_at,
            updated_at=row.updated_at,
            likes_count=row.likes_count,
            dislikes_count=row.dislikes_count,
            views_count=row.views_count,
        )
