"""Лайк комментария."""

from app.poster.comments.models import PostComment
from app.poster.comments.services.repo import CommentLikeRepository, PostCommentRepository
from app.poster.reactions.schemas import LikesSchema
from models.account import Account


class LikeCommentUseCase:
    """Ставит или убирает лайк комментарию."""

    def __init__(self, comments: PostCommentRepository, likes: CommentLikeRepository) -> None:
        self.comments = comments
        self.likes = likes

    async def execute(self, user: Account, comment: PostComment, liked: bool) -> LikesSchema:
        """Лайки комментария после нажатия. Повторное нажатие ничего не меняет."""

        if liked:
            await self.likes.add(user.id, comment.id)
        else:
            await self.likes.remove(user.id, comment.id)

        likes_count = await self.comments.refresh_likes(comment.id)

        return LikesSchema(likes_count=likes_count, liked=liked)
