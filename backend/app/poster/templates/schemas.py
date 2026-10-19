"""Шаблоны в запросах и ответах API."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.poster.publications.models import MAX_POST_HTML
from app.poster.templates.models import MAX_TEMPLATE_TITLE


class TemplateSaveSchema(BaseModel):
    """Новый шаблон: название и текст из редактора."""

    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(..., min_length=1, max_length=MAX_TEMPLATE_TITLE, description="Название")
    html: str = Field(..., min_length=1, max_length=MAX_POST_HTML, description="Текст в HTML")


class TemplateSchema(BaseModel):
    """Сохранённый шаблон."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID шаблона")
    title: str = Field(..., description="Название")
    html: str = Field(..., description="Текст в HTML")
    created_at: datetime = Field(..., description="Когда сохранён")
