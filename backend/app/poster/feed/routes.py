"""Чтение публикаций: ленты, свои посты, сохранённое и пост по id.

Пост по id объявлен последним: иначе «/feed», «/my» и другие пути попали бы в него.
"""

from fastapi import APIRouter, Depends, Query

from app.auth.sessions.dependencies import get_current_user, require_user
from app.core.pagination import PageQuery
from app.poster.feed.dependencies import (
    get_feed_repository,
    get_load_following_feed_usecase,
    get_load_marks_usecase,
)
from app.poster.feed.schemas import PostSitemapItemSchema, UnseenSchema
from app.poster.feed.services.repo import FeedRepository
from app.poster.feed.services.usecases.load_following_feed import LoadFollowingFeedUseCase
from app.poster.feed.services.usecases.load_marks import LoadMarksUseCase
from app.poster.publications.dependencies import get_visible_post
from app.poster.publications.models import Post, PostStatus
from app.poster.publications.schemas import PostPageSchema, PostSchema
from models.account import Account

router = APIRouter()


@router.get("/sitemap")
async def list_sitemap(feed: FeedRepository = Depends(get_feed_repository)) -> list[PostSitemapItemSchema]:
    """Опубликованные оригиналы для карты сайта."""

    rows = await feed.list_sitemap()

    return [
        PostSitemapItemSchema(id=post_id, author_id=author_id, updated_at=updated_at)
        for post_id, author_id, updated_at in rows
    ]


@router.get("/feed")
async def list_feed(
    page: PageQuery = Depends(),
    user: Account | None = Depends(get_current_user),
    feed: FeedRepository = Depends(get_feed_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Лента «Для вас»: опубликованные посты и репосты всех авторов. Открыта всем."""

    items, total = await feed.list_published(page.limit, page.offset)

    return PostPageSchema.for_viewer(items, total, await marks.execute(user, items))


@router.get("/feed/following/unseen")
async def count_unseen_following(
    user: Account = Depends(require_user),
    feed: FeedRepository = Depends(get_feed_repository),
) -> UnseenSchema:
    """Сколько постов вышло в подписках с прошлого захода во вкладку."""

    count = await feed.count_following_since(user.id, user.following_seen_at)

    return UnseenSchema(count=count)


@router.get("/feed/following")
async def list_following_feed(
    page: PageQuery = Depends(),
    user: Account = Depends(require_user),
    usecase: LoadFollowingFeedUseCase = Depends(get_load_following_feed_usecase),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Лента «Подписки». Первая страница обнуляет счётчик новых постов."""

    items, total = await usecase.execute(user=user, limit=page.limit, offset=page.offset)

    return PostPageSchema.for_viewer(items, total, await marks.execute(user, items))


@router.get("/author/{author_id}")
async def list_author_posts(
    author_id: int,
    page: PageQuery = Depends(),
    user: Account | None = Depends(get_current_user),
    feed: FeedRepository = Depends(get_feed_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Опубликованные посты автора для его страницы. Открыты всем."""

    items, total = await feed.list_by_author(author_id, page.limit, page.offset)

    return PostPageSchema.for_viewer(items, total, await marks.execute(user, items))


@router.get("/reposts")
async def list_my_reposts(
    page: PageQuery = Depends(),
    user: Account = Depends(require_user),
    feed: FeedRepository = Depends(get_feed_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Свои репосты, новые первыми."""

    items, total = await feed.list_reposts(user.id, page.limit, page.offset)

    return PostPageSchema.for_viewer(items, total, await marks.execute(user, items))


@router.get("/saved")
async def list_saved_posts(
    page: PageQuery = Depends(),
    user: Account = Depends(require_user),
    feed: FeedRepository = Depends(get_feed_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Сохранённые посты, недавно сохранённые первыми."""

    items, total = await feed.list_saved(user.id, page.limit, page.offset)

    return PostPageSchema.for_viewer(items, total, await marks.execute(user, items))


@router.get("/my")
async def list_my_posts(
    post_status: PostStatus = Query(PostStatus.PUBLISHED, alias="status"),
    page: PageQuery = Depends(),
    user: Account = Depends(require_user),
    feed: FeedRepository = Depends(get_feed_repository),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostPageSchema:
    """Свои посты: опубликованные, черновики или скрытые модератором."""

    items, total = await feed.list_own(user.id, post_status, page.limit, page.offset)

    return PostPageSchema.for_viewer(items, total, await marks.execute(user, items))


@router.get("/{post_id}")
async def get_post(
    post: Post = Depends(get_visible_post),
    user: Account | None = Depends(get_current_user),
    marks: LoadMarksUseCase = Depends(get_load_marks_usecase),
) -> PostSchema:
    """Пост по id: опубликованный — всем, свой черновик — автору."""

    return PostSchema.for_viewer(post, await marks.execute(user, [post]))
