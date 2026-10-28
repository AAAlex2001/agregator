from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.accounts.repository import AccountRepository
from src.core.database import get_db
from src.poster.feed.pages import PostPages
from src.poster.feed.repository import FeedRepository
from src.poster.feed.usecases.count_unseen_following import CountUnseenFollowingUseCase
from src.poster.feed.usecases.get_post import GetPostUseCase
from src.poster.feed.usecases.list_author_posts import ListAuthorPostsUseCase
from src.poster.feed.usecases.list_feed import ListFeedUseCase
from src.poster.feed.usecases.list_following_feed import ListFollowingFeedUseCase
from src.poster.feed.usecases.list_my_posts import ListMyPostsUseCase
from src.poster.feed.usecases.list_my_reposts import ListMyRepostsUseCase
from src.poster.feed.usecases.list_saved_posts import ListSavedPostsUseCase
from src.poster.feed.usecases.list_sitemap import ListSitemapUseCase
from src.poster.posts.repository import PostRepository


def get_post_pages(db: Annotated[AsyncSession, Depends(get_db)]) -> PostPages:
    """Собирает сборщик страниц постов с отметками того, кто смотрит."""
    return PostPages(FeedRepository(db), AccountRepository(db))


def get_list_feed_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    pages: Annotated[PostPages, Depends(get_post_pages)],
) -> ListFeedUseCase:
    """Собирает сценарий ленты «Для вас»."""
    return ListFeedUseCase(FeedRepository(db), pages)


def get_list_following_feed_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    pages: Annotated[PostPages, Depends(get_post_pages)],
) -> ListFollowingFeedUseCase:
    """Собирает сценарий ленты подписок."""
    return ListFollowingFeedUseCase(FeedRepository(db), AccountRepository(db), pages)


def get_list_author_posts_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    pages: Annotated[PostPages, Depends(get_post_pages)],
) -> ListAuthorPostsUseCase:
    """Собирает сценарий постов автора."""
    return ListAuthorPostsUseCase(FeedRepository(db), pages)


def get_list_my_posts_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    pages: Annotated[PostPages, Depends(get_post_pages)],
) -> ListMyPostsUseCase:
    """Собирает сценарий моих постов."""
    return ListMyPostsUseCase(FeedRepository(db), pages)


def get_list_my_reposts_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    pages: Annotated[PostPages, Depends(get_post_pages)],
) -> ListMyRepostsUseCase:
    """Собирает сценарий моих репостов."""
    return ListMyRepostsUseCase(FeedRepository(db), pages)


def get_list_saved_posts_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    pages: Annotated[PostPages, Depends(get_post_pages)],
) -> ListSavedPostsUseCase:
    """Собирает сценарий сохранённых постов."""
    return ListSavedPostsUseCase(FeedRepository(db), pages)


def get_count_unseen_following_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CountUnseenFollowingUseCase:
    """Собирает сценарий счётчика новых постов в подписках."""
    return CountUnseenFollowingUseCase(FeedRepository(db))


def get_list_sitemap_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ListSitemapUseCase:
    """Собирает сценарий карты сайта."""
    return ListSitemapUseCase(FeedRepository(db))


def get_get_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    pages: Annotated[PostPages, Depends(get_post_pages)],
) -> GetPostUseCase:
    """Собирает сценарий страницы поста."""
    return GetPostUseCase(PostRepository(db), pages)
