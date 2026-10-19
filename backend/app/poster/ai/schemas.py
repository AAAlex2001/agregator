"""ИИ-помощник в запросах и ответах API."""

from pydantic import BaseModel, ConfigDict, Field

from app.poster.ai.models import MAX_AI_INSTRUCTION
from app.poster.publications.models import MAX_POST_HTML


class AssistantRequestSchema(BaseModel):
    """Просьба к ИИ-помощнику и текущий текст поста."""

    model_config = ConfigDict(str_strip_whitespace=True)

    instruction: str = Field(
        ...,
        min_length=2,
        max_length=MAX_AI_INSTRUCTION,
        description="Что сделать с текстом",
    )
    html: str = Field("", max_length=MAX_POST_HTML, description="Текущий текст поста в HTML")


class AssistantAnswerSchema(BaseModel):
    """Текст поста от ИИ-помощника — только теги редактора."""

    html: str = Field(..., description="Готовый текст в HTML")
