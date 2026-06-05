from datetime import datetime
from typing import Literal

from pydantic import BaseModel

ArticleKindDto = Literal["news", "blog"]


class ArticleListItemDto(BaseModel):
    "Карточка статьи в списке новостей/блога."
    id: int
    kind: ArticleKindDto
    slug: str
    title: str
    excerpt: str
    cover_image: str
    tags: list[str]
    published_at: datetime | None


class ArticleListDto(BaseModel):
    "Постраничный ответ со списком статей."
    items: list[ArticleListItemDto]
    has_more: bool


class ArticleDetailDto(BaseModel):
    "Полная карточка статьи для страницы публикации (с SEO-метаданными и HTML-контентом)."
    id: int
    kind: ArticleKindDto
    slug: str
    title: str
    excerpt: str
    cover_image: str
    content_html: str
    tags: list[str]
    meta_title: str
    meta_description: str
    meta_keywords: str
    og_image: str
    published_at: datetime | None
    updated_at: datetime
