from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.notifications.usecases.notify_post_activity import NotifyPostActivityUseCase
from src.poster.comments.exceptions import CommentNotFoundError
from src.poster.comments.models import PostComment
from src.poster.comments.repository import CommentRepository
from src.poster.comments.schemas import CommentResponse, CreateCommentRequest, comment_author_ids
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository


class CreateCommentUseCase:
    """Новый комментарий под постом или ответ на комментарий."""

    def __init__(
        self,
        comments: CommentRepository,
        posts: PostRepository,
        accounts: AccountRepository,
        notify: NotifyPostActivityUseCase,
    ) -> None:
        """Принимает комментарии, посты, аккаунты и отправку уведомлений."""
        self.comments = comments
        self.posts = posts
        self.accounts = accounts
        self.notify = notify

    async def execute(self, *, user: Account, post_id: int, data: CreateCommentRequest) -> CommentResponse:
        """Сохраняет комментарий, прибавляет счётчик поста и уведомляет автора поста и того, кому ответили."""
        post = await self.posts.get_published(post_id)

        if post is None:
            raise PostNotFoundError()

        reply_to = None
        parent_id = None

        if data.reply_to_id is not None:
            reply_to = await self.comments.get(data.reply_to_id)

            if reply_to is None or reply_to.post_id != post.id:
                raise CommentNotFoundError()

            parent_id = reply_to.parent_id or reply_to.id

        comment = PostComment(
            post_id=post.id,
            author_id=user.id,
            parent_id=parent_id,
            reply_to_id=data.reply_to_id,
            text=data.text,
        )
        await self.comments.add(comment)
        await self.posts.change_comments_count(post.id, 1)
        await self.notify.execute(
            recipient_id=post.author_id,
            actor=user,
            kind="comment",
            post_id=post.id,
            comment_id=comment.id,
        )

        if reply_to is not None:
            await self.notify.execute(
                recipient_id=reply_to.author_id,
                actor=user,
                kind="reply",
                post_id=post.id,
                comment_id=comment.id,
            )

        comment = await self.comments.reload(comment)
        authors = await self.accounts.list_by_ids(comment_author_ids([comment]))

        return CommentResponse.from_comment(comment, authors, set())
