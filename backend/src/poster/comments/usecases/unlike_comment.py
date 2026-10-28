from src.accounts.models import Account
from src.poster.comments.exceptions import CommentNotFoundError
from src.poster.comments.repository import CommentRepository
from src.poster.comments.schemas import CommentLikesResponse


class UnlikeCommentUseCase:
    """Снятие лайка с комментария."""

    def __init__(self, comments: CommentRepository) -> None:
        """Принимает репозиторий комментариев."""
        self.comments = comments

    async def execute(self, *, user: Account, comment_id: int) -> CommentLikesResponse:
        """Снимает лайк и убавляет счётчик. Если лайка не было, ничего не меняет."""
        comment = await self.comments.get(comment_id)

        if comment is None:
            raise CommentNotFoundError()

        if not await self.comments.unlike(user.id, comment.id):
            return CommentLikesResponse(likes_count=comment.likes_count, liked=False)

        likes_count = await self.comments.change_likes_count(comment.id, -1)

        return CommentLikesResponse(likes_count=likes_count, liked=False)
