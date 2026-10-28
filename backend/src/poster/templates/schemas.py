from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from src.poster.posts.models import MAX_POST_HTML
from src.poster.templates.models import MAX_TEMPLATE_TITLE


class SaveTemplateRequest(BaseModel):
    """Новый шаблон: название и текст из редактора."""

    title: str = Field(min_length=1, max_length=MAX_TEMPLATE_TITLE)
    html: str = Field(min_length=1, max_length=MAX_POST_HTML)


class TemplateResponse(BaseModel):
    """Сохранённый шаблон."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    html: str
    created_at: datetime
