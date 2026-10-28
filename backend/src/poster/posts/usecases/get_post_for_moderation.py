from src.accounts.repository import AccountRepository
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository
from src.poster.posts.schemas import PostResponse, author_ids


class GetPostForModerationUseCase:
    """Любой пост для модератора: черновик, отложенный, опубликованный или скрытый."""

    def __init__(self, posts: PostRepository, accounts: AccountRepository) -> None:
        """Принимает посты и аккаунты."""
        self.posts = posts
        self.accounts = accounts

    async def execute(self, *, post_id: int) -> PostResponse:
        """Возвращает пост по id в любом статусе."""
        post = await self.posts.get(post_id)

        if post is None:
            raise PostNotFoundError()

        authors = await self.accounts.list_by_ids(author_ids([post]))

        return PostResponse.from_post(post, authors)
