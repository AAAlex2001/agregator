from src.accounts.models import Account
from src.poster.feed.pages import PostPages
from src.poster.feed.repository import FeedRepository
from src.poster.posts.schemas import PostPageResponse


class ListAuthorPostsUseCase:
    """Посты на странице автора."""

    def __init__(self, feed: FeedRepository, pages: PostPages) -> None:
        """Принимает ленты и сборку страниц постов."""
        self.feed = feed
        self.pages = pages

    async def execute(
        self,
        *,
        user: Account | None,
        author_id: int,
        limit: int,
        offset: int,
    ) -> PostPageResponse:
        """Возвращает опубликованные посты автора без репостов."""
        posts, total = await self.feed.list_by_author(author_id, limit, offset)

        return await self.pages.build(posts, total, user)
