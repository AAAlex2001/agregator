
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.article import (
    ArticleDetailDto,
    ArticleKindDto,
    ArticleListDto,
    ArticleListItemDto,
)
from services.articles import (
    ArticleRepository,
    GetArticleBySlugUseCase,
    ListArticlesUseCase,
    ListRelatedArticlesUseCase,
)

router = APIRouter(tags=["articles"])


def build_repo(db: AsyncSession) -> ArticleRepository:
    return ArticleRepository(db)


@router.get("/public/articles", response_model=ArticleListDto)
async def list_articles(
    kind: ArticleKindDto = Query(...),
    limit: int = Query(12, ge=1, le=48),
    offset: int = Query(0, ge=0),
    tag: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
) -> ArticleListDto:
    return await ListArticlesUseCase(build_repo(db)).execute(
        kind=kind, skip=offset, limit=limit, tag=tag
    )


@router.get("/public/articles/{slug}", response_model=ArticleDetailDto)
async def get_article(slug: str, db: AsyncSession = Depends(get_db)) -> ArticleDetailDto:
    return await GetArticleBySlugUseCase(build_repo(db)).execute(slug=slug)


@router.get("/public/articles/{slug}/related", response_model=list[ArticleListItemDto])
async def list_related_articles(
    slug: str,
    limit: int = Query(3, ge=1, le=12),
    db: AsyncSession = Depends(get_db),
) -> list[ArticleListItemDto]:
    return await ListRelatedArticlesUseCase(build_repo(db)).execute(slug=slug, limit=limit)
