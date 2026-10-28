from src.accounts.models import Account
from src.poster.comments.exceptions import CommentNotFoundError
from src.poster.comments.repository import CommentRepository
from src.poster.reports.repository import ReportRepository
from src.poster.reports.schemas import ReportRequest


class ReportCommentUseCase:
    """Жалоба на комментарий."""

    def __init__(self, reports: ReportRepository, comments: CommentRepository) -> None:
        """Принимает жалобы и комментарии."""
        self.reports = reports
        self.comments = comments

    async def execute(self, *, user: Account, comment_id: int, data: ReportRequest) -> None:
        """Записывает жалобу на комментарий для модератора."""
        comment = await self.comments.get(comment_id)

        if comment is None:
            raise CommentNotFoundError()

        await self.reports.add_for_comment(user.id, comment.id, data.reason)
