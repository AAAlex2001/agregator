"""Правка своего комментария."""

from app.poster.comments.models import PostComment
from app.poster.comments.schemas import CommentSchema
from app.poster.comments.services.repo import CommentLikeRepository, PostCommentRepository
from models.account import Account


class EditCommentUseCase:
    """Меняет текст своего комментария."""

    def __init__(self, comments: PostCommentRepository, likes: CommentLikeRepository) -> None:
        self.comments = comments
        self.likes = likes

    async def execute(self, user: Account, comment: PostComment, text: str) -> CommentSchema:
        """Комментарий с новым текстом и отметкой лайка автора."""

        updated = await self.comments.update_text(comment, text)
        liked = await self.likes.liked_ids(user.id, [updated.id])

        return CommentSchema.for_viewer(updated, liked)
