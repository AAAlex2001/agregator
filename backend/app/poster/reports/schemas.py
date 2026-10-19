"""Жалобы в запросах и ответах API."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.poster.comments.schemas import CommentSchema
from app.poster.publications.schemas import PostAuthorSchema, PostSchema
from app.poster.reports.models import MAX_REPORT_LENGTH, ReportStatus


class ReportSaveSchema(BaseModel):
    """Жалоба: что не так."""

    model_config = ConfigDict(str_strip_whitespace=True)

    reason: str = Field(..., min_length=3, max_length=MAX_REPORT_LENGTH, description="Причина")


class ReportSchema(BaseModel):
    """Жалоба для модератора: кто, на что и почему."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID жалобы")
    reporter: PostAuthorSchema = Field(..., description="Кто пожаловался")
    post: PostSchema | None = Field(None, description="Пост, если жалоба на пост")
    comment: CommentSchema | None = Field(None, description="Комментарий, если жалоба на комментарий")
    reason: str = Field(..., description="Причина")
    status: ReportStatus = Field(..., description="Ждёт модератора или рассмотрена")
    created_at: datetime = Field(..., description="Когда")


class ReportPageSchema(BaseModel):
    """Страница жалоб для модератора и сколько их всего."""

    items: list[ReportSchema]
    total: int
