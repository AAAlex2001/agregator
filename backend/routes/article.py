from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from models.order import OrderWorkType
from schemas.article import (
    ArticleDetailDto,
    ArticleKindDto,
    ArticleListDto,
    ArticleListItemDto,
    ArticleSitemapItemDto,
)
from services.articles import (
    ArticleRepository,
    GetArticleBySlugUseCase,
    ListArticlesUseCase,
    ListRelatedArticlesUseCase,
)
from services.articles.use_cases.list_articles import KIND_FROM_DTO

router = APIRouter(tags=["articles"])


def build_repo(db: AsyncSession) -> ArticleRepository:
    return ArticleRepository(db)


@router.get("/public/articles", response_model=ArticleListDto)
async def list_articles(
    kind: ArticleKindDto = Query(...),
    limit: int = Query(12, ge=1, le=48),
    offset: int = Query(0, ge=0),
    tag: str | None = Query(None),
    direction: OrderWorkType | None = Query(None),
    db: AsyncSession = Depends(get_db),
) -> ArticleListDto:
    "Возвращает публичный список статей выбранного типа с пагинацией и фильтрами по тегу и направлению."
    return await ListArticlesUseCase(build_repo(db)).execute(
        kind=kind, skip=offset, limit=limit, tag=tag, direction=direction
    )


@router.get("/public/articles/sitemap", response_model=list[ArticleSitemapItemDto])
async def list_articles_sitemap(
    kind: ArticleKindDto = Query(...),
    db: AsyncSession = Depends(get_db),
) -> list[ArticleSitemapItemDto]:
    "Возвращает slug и даты всех опубликованных статей типа для карты сайта."
    rows = await build_repo(db).list_published_sitemap(KIND_FROM_DTO[kind])
    return [
        ArticleSitemapItemDto(slug=slug, published_at=published_at, updated_at=updated_at)
        for slug, published_at, updated_at in rows
    ]


@router.get("/public/articles/{slug}", response_model=ArticleDetailDto)
async def get_article(slug: str, db: AsyncSession = Depends(get_db)) -> ArticleDetailDto:
    "Возвращает публичную статью по slug; 404 если не найдена."
    return await GetArticleBySlugUseCase(build_repo(db)).execute(slug=slug)


@router.get("/public/articles/{slug}/related", response_model=list[ArticleListItemDto])
async def list_related_articles(
    slug: str,
    limit: int = Query(3, ge=1, le=12),
    db: AsyncSession = Depends(get_db),
) -> list[ArticleListItemDto]:
    "Возвращает похожие статьи к указанной по slug."
    return await ListRelatedArticlesUseCase(build_repo(db)).execute(slug=slug, limit=limit)
