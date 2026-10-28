from src.accounts.repository import AccountRepository
from src.poster.comments.schemas import CommentResponse, comment_author_ids
from src.poster.posts.schemas import AuthorResponse, PostResponse, author_ids
from src.poster.reports.models import ReportStatus
from src.poster.reports.repository import ReportRepository
from src.poster.reports.schemas import ReportPageResponse, ReportResponse


class ListReportsUseCase:
    """Список жалоб для модератора."""

    def __init__(self, reports: ReportRepository, accounts: AccountRepository) -> None:
        """Принимает жалобы и аккаунты."""
        self.reports = reports
        self.accounts = accounts

    async def execute(self, *, status: ReportStatus, limit: int, offset: int) -> ReportPageResponse:
        """Возвращает страницу жалоб вместе с постами и комментариями, на которые жалуются."""
        reports = await self.reports.list_by_status(status, limit, offset)
        total = await self.reports.count_by_status(status)

        posts = [report.post for report in reports if report.post is not None]
        comments = [report.comment for report in reports if report.comment is not None]
        reporter_ids = {report.reporter_id for report in reports}
        account_ids = reporter_ids | author_ids(posts) | comment_author_ids(comments)
        accounts = await self.accounts.list_by_ids(account_ids)

        items = []

        for report in reports:
            post = None
            comment = None

            if report.post is not None:
                post = PostResponse.from_post(report.post, accounts)

            if report.comment is not None:
                comment = CommentResponse.from_comment(report.comment, accounts, set())

            items.append(
                ReportResponse(
                    id=report.id,
                    reporter=AuthorResponse.from_account(accounts[report.reporter_id]),
                    post=post,
                    comment=comment,
                    reason=report.reason,
                    status=ReportStatus(report.status),
                    created_at=report.created_at,
                )
            )

        return ReportPageResponse(items=items, total=total)
