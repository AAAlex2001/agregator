"Use case: создание/обновление статьи с нормализацией slug, даты публикации и привязкой тегов."

from datetime import UTC, datetime
from typing import Any

from models.article import Article, ArticleKind, ArticleStatus
from schemas.admin_article import ArticleWrite
from services.articles.repository import ArticleRepository
from services.tags import TagRepository


class SlugTakenError(Exception):
    "Slug уже занят другой записью."


class SaveArticleUseCase:
    def __init__(self, repo: ArticleRepository, tag_repo: TagRepository) -> None:
        self.repo = repo
        self.tag_repo = tag_repo

    async def create(self, data: ArticleWrite) -> Article:
        values = self.normalize(data)
        if await self.repo.slug_exists(values["slug"]):
            raise SlugTakenError
        tags = await self.tag_repo.get_or_create_many(data.tags)
        return await self.repo.create(values, tags)

    async def update(self, article: Article, data: ArticleWrite) -> Article:
        values = self.normalize(data)
        if values["slug"] != article.slug and await self.repo.slug_exists(values["slug"], exclude_id=article.id):
            raise SlugTakenError
        tags = await self.tag_repo.get_or_create_many(data.tags)
        return await self.repo.update(article, values, tags)

    def normalize(self, data: ArticleWrite) -> dict[str, Any]:
        published_at = data.published_at
        if data.status == "PUBLISHED" and published_at is None:
            published_at = datetime.now(UTC)
        return {
            "kind": ArticleKind(data.kind),
            "status": ArticleStatus(data.status),
            "slug": data.slug.strip().lower().replace(" ", "-"),
            "title": data.title.strip(),
            "excerpt": data.excerpt,
            "cover_image": data.cover_image.strip(),
            "tg_cover_image": data.tg_cover_image.strip(),
            "content_html": data.content_html,
            "meta_title": data.meta_title.strip(),
            "meta_description": data.meta_description,
            "meta_keywords": data.meta_keywords,
            "og_image": data.og_image.strip(),
            "published_at": published_at,
        }
