"""Файл поста в ответах API."""

from pydantic import BaseModel, ConfigDict, Field

from app.poster.media.models import MediaKind


class PostMediaSchema(BaseModel):
    """Фото или видео к посту."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID файла")
    kind: MediaKind = Field(..., description="Фото или видео")
    url: str = Field(..., description="Адрес файла")
