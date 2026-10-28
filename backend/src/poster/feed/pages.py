from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.poster.feed.repository import FeedRepository
from src.poster.posts.models import Post
from src.poster.posts.schemas import PostPageResponse, PostResponse, author_ids


class PostPages:
    """Собирает посты для того, кто смотрит: с его лайками, сохранениями и подписками."""

    def __init__(self, feed: FeedRepository, accounts: AccountRepository) -> None:
        """Принимает ленты и аккаунты."""
        self.feed = feed
        self.accounts = accounts

    async def build(self, posts: list[Post], total: int, viewer: Account | None) -> PostPageResponse:
        """Собирает страницу постов. Каналы поста видит только его автор."""
        authors = await self.accounts.list_by_ids(author_ids(posts))
        liked_ids: set[int] = set()
        saved_ids: set[int] = set()
        followed_ids: set[int] = set()

        if viewer is not None:
            post_ids = [post.id for post in posts]
            liked_ids = await self.feed.list_liked_ids(viewer.id, post_ids)
            saved_ids = await self.feed.list_saved_ids(viewer.id, post_ids)
            followed_ids = await self.feed.list_followed_ids(viewer.id, [post.author_id for post in posts])

        items = []

        for post in posts:
            item = PostResponse.from_post(post, authors)
            item.liked = post.id in liked_ids
            item.saved = post.id in saved_ids
            item.following = post.author_id in followed_ids

            if viewer is None or viewer.id != post.author_id:
                item.deliveries = []

            items.append(item)

        return PostPageResponse(items=items, total=total)
