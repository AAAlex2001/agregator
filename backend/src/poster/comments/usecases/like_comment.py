from src.accounts.models import Account
from src.poster.comments.exceptions import CommentNotFoundError
from src.poster.comments.repository import CommentRepository
from src.poster.comments.schemas import CommentLikesResponse
from src.poster.posts.repository import PostRepository


class LikeCommentUseCase:
    """Лайк под комментарием."""

    def __init__(self, comments: CommentRepository, posts: PostRepository) -> None:
        """Принимает комментарии и посты."""
        self.comments = comments
        self.posts = posts

    async def execute(self, *, user: Account, comment_id: int) -> CommentLikesResponse:
        """Ставит лайк и прибавляет счётчик. Повторный лайк ничего не меняет."""
        comment = await self.comments.get(comment_id)

        if comment is None or await self.posts.get_published(comment.post_id) is None:
            raise CommentNotFoundError()

        if not await self.comments.like(user.id, comment.id):
            return CommentLikesResponse(likes_count=comment.likes_count, liked=True)

        likes_count = await self.comments.change_likes_count(comment.id, 1)

        return CommentLikesResponse(likes_count=likes_count, liked=True)
