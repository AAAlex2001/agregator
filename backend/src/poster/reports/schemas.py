from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from src.poster.comments.schemas import CommentResponse
from src.poster.posts.schemas import AuthorResponse, PostResponse
from src.poster.reports.models import MAX_REPORT_LENGTH, ReportStatus


class ModerationStatus(StrEnum):
    """Что модератор делает с постом: оставляет опубликованным или скрывает."""

    PUBLISHED = "published"
    HIDDEN = "hidden"


class ReportRequest(BaseModel):
    """Жалоба: почему пост или комментарий нарушает правила."""

    model_config = ConfigDict(str_strip_whitespace=True)

    reason: str = Field(min_length=3, max_length=MAX_REPORT_LENGTH)


class ReportResponse(BaseModel):
    """Жалоба для модератора: кто пожаловался, на что и почему."""

    id: int
    reporter: AuthorResponse
    post: PostResponse | None
    comment: CommentResponse | None
    reason: str
    status: ReportStatus
    created_at: datetime


class ReportPageResponse(BaseModel):
    """Страница жалоб и сколько их всего."""

    items: list[ReportResponse]
    total: int
