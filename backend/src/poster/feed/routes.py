from typing import Annotated

from fastapi import APIRouter, Depends, Query

from src.accounts.models import Account
from src.auth.sessions.dependencies import get_current_user, require_user
from src.poster.feed.dependencies import (
    get_count_unseen_following_usecase,
    get_get_post_usecase,
    get_list_author_posts_usecase,
    get_list_feed_usecase,
    get_list_following_feed_usecase,
    get_list_my_posts_usecase,
    get_list_my_reposts_usecase,
    get_list_saved_posts_usecase,
    get_list_sitemap_usecase,
)
from src.poster.feed.schemas import SitemapItemResponse, UnseenCountResponse
from src.poster.feed.usecases.count_unseen_following import CountUnseenFollowingUseCase
from src.poster.feed.usecases.get_post import GetPostUseCase
from src.poster.feed.usecases.list_author_posts import ListAuthorPostsUseCase
from src.poster.feed.usecases.list_feed import ListFeedUseCase
from src.poster.feed.usecases.list_following_feed import ListFollowingFeedUseCase
from src.poster.feed.usecases.list_my_posts import ListMyPostsUseCase
from src.poster.feed.usecases.list_my_reposts import ListMyRepostsUseCase
from src.poster.feed.usecases.list_saved_posts import ListSavedPostsUseCase
from src.poster.feed.usecases.list_sitemap import ListSitemapUseCase
from src.poster.posts.models import PostStatus
from src.poster.posts.schemas import PostPageResponse, PostResponse

router = APIRouter(prefix="/posts", tags=["Ленты"])

Limit = Annotated[int, Query(ge=1, le=1000)]
Offset = Annotated[int, Query(ge=0)]


@router.get("/sitemap", response_model=list[SitemapItemResponse])
async def list_sitemap(
    usecase: Annotated[ListSitemapUseCase, Depends(get_list_sitemap_usecase)],
) -> list[SitemapItemResponse]:
    """Возвращает опубликованные посты для карты сайта."""
    return await usecase.execute()


@router.get("/feed", response_model=PostPageResponse)
async def list_feed(
    user: Annotated[Account | None, Depends(get_current_user)],
    usecase: Annotated[ListFeedUseCase, Depends(get_list_feed_usecase)],
    limit: Limit = 20,
    offset: Offset = 0,
) -> PostPageResponse:
    """Возвращает ленту «Для вас»."""
    return await usecase.execute(user=user, limit=limit, offset=offset)


@router.get("/feed/following/unseen", response_model=UnseenCountResponse)
async def count_unseen_following(
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[CountUnseenFollowingUseCase, Depends(get_count_unseen_following_usecase)],
) -> UnseenCountResponse:
    """Возвращает, сколько новых постов в моих подписках."""
    return await usecase.execute(user=user)


@router.get("/feed/following", response_model=PostPageResponse)
async def list_following_feed(
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ListFollowingFeedUseCase, Depends(get_list_following_feed_usecase)],
    limit: Limit = 20,
    offset: Offset = 0,
) -> PostPageResponse:
    """Возвращает ленту моих подписок."""
    return await usecase.execute(user=user, limit=limit, offset=offset)


@router.get("/author/{author_id}", response_model=PostPageResponse)
async def list_author_posts(
    author_id: int,
    user: Annotated[Account | None, Depends(get_current_user)],
    usecase: Annotated[ListAuthorPostsUseCase, Depends(get_list_author_posts_usecase)],
    limit: Limit = 20,
    offset: Offset = 0,
) -> PostPageResponse:
    """Возвращает посты автора для его страницы."""
    return await usecase.execute(user=user, author_id=author_id, limit=limit, offset=offset)


@router.get("/reposts", response_model=PostPageResponse)
async def list_my_reposts(
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ListMyRepostsUseCase, Depends(get_list_my_reposts_usecase)],
    limit: Limit = 20,
    offset: Offset = 0,
) -> PostPageResponse:
    """Возвращает мои репосты."""
    return await usecase.execute(user=user, limit=limit, offset=offset)


@router.get("/saved", response_model=PostPageResponse)
async def list_saved_posts(
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ListSavedPostsUseCase, Depends(get_list_saved_posts_usecase)],
    limit: Limit = 20,
    offset: Offset = 0,
) -> PostPageResponse:
    """Возвращает мои сохранённые посты."""
    return await usecase.execute(user=user, limit=limit, offset=offset)


@router.get("/my", response_model=PostPageResponse)
async def list_my_posts(
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ListMyPostsUseCase, Depends(get_list_my_posts_usecase)],
    post_status: Annotated[PostStatus, Query(alias="status")] = PostStatus.PUBLISHED,
    limit: Limit = 20,
    offset: Offset = 0,
) -> PostPageResponse:
    """Возвращает мои посты в одном состоянии: опубликованные, черновики, отложенные или скрытые."""
    return await usecase.execute(user=user, status=post_status, limit=limit, offset=offset)


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    user: Annotated[Account | None, Depends(get_current_user)],
    usecase: Annotated[GetPostUseCase, Depends(get_get_post_usecase)],
) -> PostResponse:
    """Возвращает пост, если мне его можно видеть."""
    return await usecase.execute(user=user, post_id=post_id)
