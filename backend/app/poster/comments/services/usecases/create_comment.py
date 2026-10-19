"""Новый комментарий или ответ."""

from app.poster.comments.models import PostComment
from app.poster.comments.services.exceptions import CommentNotFoundError
from app.poster.comments.services.repo import PostCommentRepository
from app.poster.notifications import ActivityNotifier
from app.poster.publications.models import Post
from models.account import Account


class CreateCommentUseCase:
    """Комментарий к посту. Ответ попадает в ветку корневого комментария.

    Автору поста приходит уведомление о комментарии, автору комментария — об ответе.
    """

    def __init__(self, comments: PostCommentRepository, notify: ActivityNotifier) -> None:
        self.comments = comments
        self.notify = notify

    async def reply_target(self, post: Post, reply_to_id: int | None) -> PostComment | None:
        """Комментарий, на который отвечают. Нет или он к другому посту — CommentNotFoundError."""

        if reply_to_id is None:
            return None

        reply_to = await self.comments.get_by_id(reply_to_id)
        if reply_to is None or reply_to.post_id != post.id:
            raise CommentNotFoundError

        return reply_to

    async def execute(
        self,
        user: Account,
        post: Post,
        text: str,
        reply_to_id: int | None,
    ) -> PostComment:
        """Сохраняет комментарий и уведомляет того, кому он адресован."""

        reply_to = await self.reply_target(post, reply_to_id)
        comment = PostComment(
            post_id=post.id,
            author_id=user.id,
            reply_to_id=reply_to_id,
            text=text,
        )

        if reply_to is None:
            created = await self.comments.add(comment)
            await self.notify.execute(post.author_id, user, "comment", post_id=post.id, comment_id=created.id)
            return created

        comment.parent_id = reply_to.parent_id or reply_to.id
        created = await self.comments.add(comment)
        await self.notify.execute(reply_to.author_id, user, "reply", post_id=post.id, comment_id=created.id)

        return created
