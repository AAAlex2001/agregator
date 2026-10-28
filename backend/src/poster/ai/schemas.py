from pydantic import BaseModel, Field

from src.poster.ai.models import MAX_AI_INSTRUCTION
from src.poster.posts.models import MAX_POST_HTML


class WriteWithAiRequest(BaseModel):
    """Просьба к ИИ-помощнику и текущий текст поста."""

    instruction: str = Field(min_length=2, max_length=MAX_AI_INSTRUCTION)
    html: str = Field(default="", max_length=MAX_POST_HTML)


class WriteWithAiResponse(BaseModel):
    """Текст поста, который написал ИИ-помощник."""

    html: str
