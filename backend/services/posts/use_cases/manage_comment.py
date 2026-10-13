"""Сценарии своего комментария: правка текста и лайк."""

from models.account import Account
from models.posts import PostComment
from schemas.posts import CommentSchema, LikesSchema
from services.posts.comment_repo import CommentLikeRepository, PostCommentRepository


class EditCommentUseCase:
    """Меняет текст своего комментария."""

    def __init__(self, comments: PostCommentRepository, likes: CommentLikeRepository) -> None:
        self.comments = comments
        self.likes = likes

    async def execute(self, user: Account, comment: PostComment, text: str) -> CommentSchema:
        """Комментарий с новым текстом и отметкой лайка автора."""

        updated = await self.comments.update_text(comment, text)
        return CommentSchema.for_viewer(updated, await self.likes.liked_ids(user.id, [updated.id]))


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
        return LikesSchema(likes_count=await self.comments.refresh_likes(comment.id), liked=liked)
