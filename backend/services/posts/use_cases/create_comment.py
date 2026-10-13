"""Сценарий нового комментария или ответа."""

from models.account import Account
from models.posts import Post, PostComment
from schemas.posts import CommentSaveSchema
from services.notifications.use_cases.create_post_activity_notification import (
    CreatePostActivityNotificationUseCase,
)
from services.posts.comment_repo import PostCommentRepository
from services.posts.exceptions import CommentNotFoundError


class CreateCommentUseCase:
    """Комментарий к посту. Ответ попадает в ветку корневого комментария.

    Автору поста приходит уведомление о комментарии, автору комментария — об ответе.
    """

    def __init__(
        self,
        comments: PostCommentRepository,
        notify: CreatePostActivityNotificationUseCase,
    ) -> None:
        self.comments = comments
        self.notify = notify

    async def reply_target(self, post: Post, reply_to_id: int | None) -> PostComment | None:
        """Комментарий, на который отвечают. Нет или он к другому посту — CommentNotFoundError."""

        if reply_to_id is None:
            return None
        reply_to = await self.comments.get_by_id(reply_to_id)
        if reply_to is None or reply_to.post_id != post.id:
            raise CommentNotFoundError()
        return reply_to

    async def execute(self, user: Account, post: Post, payload: CommentSaveSchema) -> PostComment:
        """Новый комментарий."""

        reply_to = await self.reply_target(post, payload.reply_to_id)

        comment = PostComment(
            post_id=post.id,
            author_id=user.id,
            reply_to_id=payload.reply_to_id,
            text=payload.text,
        )
        if reply_to:
            comment.parent_id = reply_to.parent_id or reply_to.id
        created = await self.comments.add(comment)

        if reply_to:
            await self.notify.execute(
                reply_to.author_id,
                user,
                "reply",
                post_id=post.id,
                comment_id=created.id,
            )
        else:
            await self.notify.execute(
                post.author_id,
                user,
                "comment",
                post_id=post.id,
                comment_id=created.id,
            )
        return created
