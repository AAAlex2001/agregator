"""Комментарии в запросах и ответах API."""

from datetime import datetime
from typing import Self

from pydantic import BaseModel, ConfigDict, Field

from app.poster.comments.models import MAX_COMMENT_LENGTH, PostComment
from app.poster.publications.schemas import PostAuthorSchema


class CommentSaveSchema(BaseModel):
    """Новый комментарий или ответ на комментарий."""

    model_config = ConfigDict(str_strip_whitespace=True)

    text: str = Field(..., min_length=1, max_length=MAX_COMMENT_LENGTH, description="Текст")
    reply_to_id: int | None = Field(None, description="На какой комментарий ответ")


class CommentEditSchema(BaseModel):
    """Новый текст своего комментария."""

    model_config = ConfigDict(str_strip_whitespace=True)

    text: str = Field(..., min_length=1, max_length=MAX_COMMENT_LENGTH, description="Текст")


class CommentSchema(BaseModel):
    """Комментарий к посту. parent_id — корень ветки, пусто у корневого."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID комментария")
    post_id: int = Field(..., description="Публикация комментария")
    author: PostAuthorSchema = Field(..., description="Автор")
    text: str = Field(..., description="Текст")
    parent_id: int | None = Field(None, description="Корень ветки")
    reply_to_name: str | None = Field(None, description="Кому ответ")
    likes_count: int = Field(..., description="Сколько лайков")
    liked: bool = Field(False, description="Вы поставили лайк")
    created_at: datetime = Field(..., description="Когда написан")

    @classmethod
    def for_viewer(cls, comment: PostComment, liked: set[int]) -> Self:
        """Комментарий с отметкой лайка того, кто смотрит."""

        schema = cls.model_validate(comment)
        schema.liked = comment.id in liked

        return schema


class CommentThreadSchema(BaseModel):
    """Ветка: корневой комментарий и ответы в ней по порядку."""

    comment: CommentSchema
    replies: list[CommentSchema]


class CommentThreadPageSchema(BaseModel):
    """Страница веток, сколько веток всего и сколько комментариев у поста."""

    items: list[CommentThreadSchema]
    total: int = Field(..., description="Сколько веток всего")
    comments_count: int = Field(..., description="Сколько комментариев у поста вместе с ответами")
