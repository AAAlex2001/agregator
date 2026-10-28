from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.poster.comments.repository import CommentRepository
from src.poster.comments.schemas import (
    CommentPageResponse,
    CommentResponse,
    CommentThreadResponse,
    comment_author_ids,
)
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository


class ListCommentsUseCase:
    """Комментарии под постом, собранные в ветки."""

    def __init__(
        self,
        comments: CommentRepository,
        posts: PostRepository,
        accounts: AccountRepository,
    ) -> None:
        """Принимает комментарии, посты и аккаунты."""
        self.comments = comments
        self.posts = posts
        self.accounts = accounts

    async def execute(
        self,
        *,
        user: Account | None,
        post_id: int,
        limit: int,
        offset: int,
    ) -> CommentPageResponse:
        """Возвращает страницу веток: первый комментарий и все ответы под ним."""
        viewer_id = user.id if user is not None else None
        post = await self.posts.get_visible(post_id, viewer_id)

        if post is None:
            raise PostNotFoundError()

        roots = await self.comments.list_roots(post.id, limit, offset)
        total = await self.comments.count_roots(post.id)
        replies = await self.comments.list_replies([root.id for root in roots])
        all_comments = roots + replies
        authors = await self.accounts.list_by_ids(comment_author_ids(all_comments))
        liked_ids: set[int] = set()

        if user is not None:
            liked_ids = await self.comments.list_liked_ids(user.id, [comment.id for comment in all_comments])

        threads = []

        for root in roots:
            root_replies = [reply for reply in replies if reply.parent_id == root.id]
            thread = CommentThreadResponse(
                comment=CommentResponse.from_comment(root, authors, liked_ids),
                replies=[CommentResponse.from_comment(reply, authors, liked_ids) for reply in root_replies],
            )
            threads.append(thread)

        return CommentPageResponse(items=threads, total=total, comments_count=post.comments_count)
