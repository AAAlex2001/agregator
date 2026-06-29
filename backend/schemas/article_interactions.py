from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

ReactionValueDto = Literal["LIKE", "DISLIKE"]


class ReactionRequest(BaseModel):
    value: ReactionValueDto


class ReactionResponse(BaseModel):
    likes_count: int
    dislikes_count: int
    my_reaction: ReactionValueDto | None


class ViewResponse(BaseModel):
    views_count: int


class CommentCreate(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    parent_id: int | None = None


class CommentResponse(BaseModel):
    id: int
    parent_id: int | None
    text: str
    author_name: str
    created_at: datetime
    is_mine: bool


class CommentListResponse(BaseModel):
    items: list[CommentResponse]
