"Тонкий CRUD статей для кастомной админки (admin-next). За X-Internal-Token; логин держит сама админка."

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    Query,
    Response,
    UploadFile,
    status,
)
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
    TagCreate,
    TagOut,
    UploadOut,
)
from services.articles import ArticleRepository
from services.articles.tag_repository import TagRepository
from services.articles.use_cases.notify_blog_published import NotifyBlogPublishedUseCase
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

VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".m4v"}
VIDEO_CONTENT_TYPES = {"video/mp4", "video/webm", "video/quicktime", "video/x-m4v"}
MAX_VIDEO_SIZE = 200 * 1024 * 1024


def to_out(a: Article) -> ArticleOut:
    return ArticleOut(
        id=a.id,
        kind=a.kind.value,
        status=a.status.value,
        slug=a.slug,
        title=a.title,
        excerpt=a.excerpt,
        cover_image=a.cover_image,
        tg_cover_image=a.tg_cover_image,
        tags=[t.name for t in a.tags],
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
    db: AsyncSession = Depends(get_db),
) -> ArticleListOut:
    rows = await ArticleRepository(db).list_all(
        kind=ArticleKind(kind) if kind else None,
        status=ArticleStatus(article_status) if article_status else None,
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
    return ArticleListOut(items=items, total=len(items))


@router.get("/articles/{article_id}", response_model=ArticleOut)
async def get_article(article_id: int, db: AsyncSession = Depends(get_db)) -> ArticleOut:
    article = await ArticleRepository(db).get_by_id(article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")
    return to_out(article)


@router.post("/articles", response_model=ArticleOut, status_code=status.HTTP_201_CREATED)
async def create_article(
    data: ArticleWrite,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> ArticleOut:
    try:
        article = await SaveArticleUseCase(ArticleRepository(db), TagRepository(db)).create(data)
    except SlugTakenError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Такой slug уже занят")
    await maybe_notify_blog(article, db, background_tasks)
    return to_out(article)


@router.put("/articles/{article_id}", response_model=ArticleOut)
async def update_article(
    article_id: int,
    data: ArticleWrite,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> ArticleOut:
    repo = ArticleRepository(db)
    article = await repo.get_by_id(article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")
    try:
        article = await SaveArticleUseCase(repo, TagRepository(db)).update(article, data)
    except SlugTakenError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Такой slug уже занят")
    await maybe_notify_blog(article, db, background_tasks)
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


@router.post("/upload-video", response_model=UploadOut)
async def upload_video(file: UploadFile = File(...)) -> UploadOut:
    "Сохраняет видео для встраивания в статью и возвращает его публичный URL."
    url = await save_uploaded_file(
        subdir="articles",
        owner_key="videos",
        file=file,
        allowed_extensions=VIDEO_EXTENSIONS,
        allowed_content_types=VIDEO_CONTENT_TYPES,
        max_size=MAX_VIDEO_SIZE,
        bad_format_message="Недопустимый формат видео (mp4, webm, mov, m4v)",
        too_large_message="Видео слишком большое (макс 200 МБ)",
    )
    return UploadOut(url=url)


@router.get("/tags", response_model=list[TagOut])
async def list_tags(db: AsyncSession = Depends(get_db)) -> list[TagOut]:
    return [TagOut(id=t.id, name=t.name) for t in await TagRepository(db).list_all()]


@router.post("/tags", response_model=TagOut, status_code=status.HTTP_201_CREATED)
async def create_tag(data: TagCreate, db: AsyncSession = Depends(get_db)) -> TagOut:
    tag = await TagRepository(db).create(data.name.strip())
    return TagOut(id=tag.id, name=tag.name)


@router.put("/tags/{tag_id}", response_model=TagOut)
async def rename_tag(tag_id: int, data: TagCreate, db: AsyncSession = Depends(get_db)) -> TagOut:
    repo = TagRepository(db)
    name = data.name.strip()
    if await repo.name_taken(name, exclude_id=tag_id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Тег с таким именем уже есть")
    tag = await repo.rename(tag_id, name)
    if tag is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Тег не найден")
    return TagOut(id=tag.id, name=tag.name)


@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(tag_id: int, db: AsyncSession = Depends(get_db)) -> Response:
    await TagRepository(db).delete(tag_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def maybe_notify_blog(article: Article, db: AsyncSession, background_tasks: BackgroundTasks) -> None:
    "Опубликованный пост блога триггерит уведомления (идемпотентно по slug)."
    if article.kind == ArticleKind.BLOG and article.status == ArticleStatus.PUBLISHED:
        await NotifyBlogPublishedUseCase(db, background_tasks).execute(
            slug=article.slug, title=article.title, preview=article.excerpt or ""
        )
