from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.poster.comments.exceptions import CommentNotFoundError
from src.poster.comments.repository import CommentRepository
from src.poster.comments.schemas import CommentResponse, UpdateCommentRequest, comment_author_ids


class UpdateCommentUseCase:
    """Правка своего комментария."""

    def __init__(self, comments: CommentRepository, accounts: AccountRepository) -> None:
        """Принимает комментарии и аккаунты."""
        self.comments = comments
        self.accounts = accounts

    async def execute(self, *, user: Account, comment_id: int, data: UpdateCommentRequest) -> CommentResponse:
        """Меняет текст комментария пользователя."""
        comment = await self.comments.get_for_author(comment_id, user.id)

        if comment is None:
            raise CommentNotFoundError()

        comment.text = data.text
        await self.comments.save()

        authors = await self.accounts.list_by_ids(comment_author_ids([comment]))
        liked_ids = await self.comments.list_liked_ids(user.id, [comment.id])

        return CommentResponse.from_comment(comment, authors, liked_ids)
