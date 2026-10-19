"""Лайки в ответах API."""

from pydantic import BaseModel, Field


class LikesSchema(BaseModel):
    """Лайки поста или комментария после нажатия."""

    likes_count: int = Field(..., description="Сколько лайков")
    liked: bool = Field(..., description="Вы поставили лайк")
