"Тонкий CRUD статей для кастомной админки (admin-next). За X-Internal-Token; логин держит сама админка."

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.internal_auth import require_internal_token
from models.article import Article, ArticleKind, ArticleStatus
from schemas.admin_article import (
    ArticleListItem,
    ArticleListOut,
    ArticleOut,
    ArticleWrite,
    Kind,
    Status,
    UploadOut,
)
from services.articles import ArticleRepository
from services.articles.use_cases.save_article import SaveArticleUseCase, SlugTakenError
from services.file_uploads import save_uploaded_file

router = APIRouter(
    prefix="/internal/content",
    tags=["admin-content"],
    dependencies=[Depends(require_internal_token)],
)

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_IMAGE_SIZE = 20 * 1024 * 1024


def to_out(a: Article) -> ArticleOut:
    return ArticleOut(
        id=a.id,
        kind=a.kind.value,
        status=a.status.value,
        slug=a.slug,
        title=a.title,
        excerpt=a.excerpt,
        cover_image=a.cover_image,
        tags=[str(t) for t in a.tags],
        content_html=a.content_html,
        meta_title=a.meta_title,
        meta_description=a.meta_description,
        meta_keywords=a.meta_keywords,
        og_image=a.og_image,
        published_at=a.published_at,
        created_at=a.created_at,
        updated_at=a.updated_at,
    )


@router.get("/articles", response_model=ArticleListOut)
async def list_articles(
    kind: Kind | None = Query(None),
    article_status: Status | None = Query(None, alias="status"),
    search: str | None = Query(None, max_length=200),
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
) -> ArticleListOut:
    rows, total = await ArticleRepository(db).list_all(
        kind=ArticleKind(kind) if kind else None,
        status=ArticleStatus(article_status) if article_status else None,
        search=search,
        offset=offset,
        limit=limit,
    )
    items = [
        ArticleListItem(
            id=r.id,
            kind=r.kind.value,
            status=r.status.value,
            title=r.title,
            slug=r.slug,
            published_at=r.published_at,
            updated_at=r.updated_at,
        )
        for r in rows
    ]
    return ArticleListOut(items=items, total=total)


@router.get("/articles/{article_id}", response_model=ArticleOut)
async def get_article(article_id: int, db: AsyncSession = Depends(get_db)) -> ArticleOut:
    article = await ArticleRepository(db).get_by_id(article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")
    return to_out(article)


@router.post("/articles", response_model=ArticleOut, status_code=status.HTTP_201_CREATED)
async def create_article(data: ArticleWrite, db: AsyncSession = Depends(get_db)) -> ArticleOut:
    try:
        article = await SaveArticleUseCase(ArticleRepository(db)).create(data)
    except SlugTakenError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Такой slug уже занят")
    return to_out(article)


@router.put("/articles/{article_id}", response_model=ArticleOut)
async def update_article(article_id: int, data: ArticleWrite, db: AsyncSession = Depends(get_db)) -> ArticleOut:
    repo = ArticleRepository(db)
    article = await repo.get_by_id(article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")
    try:
        article = await SaveArticleUseCase(repo).update(article, data)
    except SlugTakenError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Такой slug уже занят")
    return to_out(article)


@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(article_id: int, db: AsyncSession = Depends(get_db)) -> Response:
    repo = ArticleRepository(db)
    article = await repo.get_by_id(article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")
    await repo.delete(article)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/upload-image", response_model=UploadOut)
async def upload_image(file: UploadFile = File(...)) -> UploadOut:
    url = await save_uploaded_file(
        subdir="articles",
        owner_key="editor",
        file=file,
        allowed_extensions=IMAGE_EXTENSIONS,
        allowed_content_types=IMAGE_CONTENT_TYPES,
        max_size=MAX_IMAGE_SIZE,
        bad_format_message="Недопустимое расширение",
        too_large_message="Файл слишком большой",
    )
    return UploadOut(url=url)
