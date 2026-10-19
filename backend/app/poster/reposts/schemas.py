"""Репост в запросах API."""

from pydantic import BaseModel, Field

from app.poster.publications.models import MAX_POST_HTML


class RepostSaveSchema(BaseModel):
    """Репост: без текста или с комментарием из редактора."""

    html: str = Field("", max_length=MAX_POST_HTML, description="Комментарий к репосту в HTML")
