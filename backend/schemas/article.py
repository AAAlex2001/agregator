from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel


ArticleKindDto = Literal["news", "blog"]


class ArticleListItemDto(BaseModel):
    id: int
    kind: ArticleKindDto
    slug: str
    title: str
    excerpt: str
    cover_image: str
    tags: List[str]
    published_at: Optional[datetime]


class ArticleListDto(BaseModel):
    items: List[ArticleListItemDto]
    has_more: bool


class ArticleDetailDto(BaseModel):
    id: int
    kind: ArticleKindDto
    slug: str
    title: str
    excerpt: str
    cover_image: str
    content_html: str
    tags: List[str]
    meta_title: str
    meta_description: str
    meta_keywords: str
    og_image: str
    published_at: Optional[datetime]
    updated_at: datetime
