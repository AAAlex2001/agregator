from src.accounts.repository import AccountRepository
from src.poster.posts.models import PostStatus
from src.poster.posts.repository import PostRepository
from src.poster.posts.schemas import PostPageResponse, PostResponse, author_ids


class ListPostsForModerationUseCase:
    """Список постов для модератора в админке."""

    def __init__(self, posts: PostRepository, accounts: AccountRepository) -> None:
        """Принимает посты и аккаунты."""
        self.posts = posts
        self.accounts = accounts

    async def execute(
        self,
        *,
        status: PostStatus,
        author_id: int | None,
        limit: int,
        offset: int,
    ) -> PostPageResponse:
        """Возвращает страницу постов в одном статусе и сколько их всего. Можно выбрать автора."""
        posts = await self.posts.list_by_status(status, author_id, limit, offset)
        total = await self.posts.count_by_status(status, author_id)
        authors = await self.accounts.list_by_ids(author_ids(posts))

        return PostPageResponse(
            items=[PostResponse.from_post(post, authors) for post in posts],
            total=total,
        )
