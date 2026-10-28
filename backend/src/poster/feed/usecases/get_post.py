from src.accounts.models import Account
from src.poster.feed.pages import PostPages
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository
from src.poster.posts.schemas import PostResponse


class GetPostUseCase:
    """Страница одного поста."""

    def __init__(self, posts: PostRepository, pages: PostPages) -> None:
        """Принимает посты и сборку страниц постов."""
        self.posts = posts
        self.pages = pages

    async def execute(self, *, user: Account | None, post_id: int) -> PostResponse:
        """Возвращает пост, если его можно показать этому человеку."""
        viewer_id = user.id if user is not None else None
        post = await self.posts.get_visible(post_id, viewer_id)

        if post is None:
            raise PostNotFoundError()

        page = await self.pages.build([post], 1, user)

        return page.items[0]
