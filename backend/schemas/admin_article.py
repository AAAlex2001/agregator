from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

Kind = Literal["NEWS", "BLOG"]
Status = Literal["DRAFT", "PUBLISHED"]


class ArticleWrite(BaseModel):
    kind: Kind
    status: Status
    slug: str = Field(min_length=1, max_length=220)
    title: str = Field(default="", max_length=300)
    excerpt: str = ""
    cover_image: str = Field(default="", max_length=500)
    tags: list[str] = Field(default_factory=list)
    content_html: str = ""
    meta_title: str = Field(default="", max_length=300)
    meta_description: str = ""
    meta_keywords: str = ""
    og_image: str = Field(default="", max_length=500)
    published_at: datetime | None = None


class ArticleOut(ArticleWrite):
    id: int
    created_at: datetime
    updated_at: datetime


class ArticleListItem(BaseModel):
    id: int
    kind: Kind
    status: Status
    title: str
    slug: str
    published_at: datetime | None
    updated_at: datetime


class ArticleListOut(BaseModel):
    items: list[ArticleListItem]
    total: int


class UploadOut(BaseModel):
    url: str


class TagOut(BaseModel):
    id: int
    name: str


class TagCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
