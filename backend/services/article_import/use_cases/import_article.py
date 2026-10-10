"Use case: загрузка статьи из файла в БД, обновление по slug и перенос счётчиков старой новости."

from datetime import datetime
from typing import Any

from models.article import ArticleKind, ArticleStatus
from models.order import OrderWorkType
from services.article_import.loader import copy_cover
from services.article_import.repository import LegacyNewsRepository
from services.articles.repository import ArticleRepository
from services.tags import TagRepository


class ImportArticleUseCase:
    "Файл — источник правды: существующая статья с тем же slug перезаписывается целиком."

    def __init__(self, repo: ArticleRepository, tags: TagRepository, legacy: LegacyNewsRepository) -> None:
        self.repo = repo
        self.tags = tags
        self.legacy = legacy

    async def execute(self, article: dict[str, Any]) -> bool:
        "Создаёт или обновляет статью. True — создана, False — обновлена."
        cover = copy_cover(article["slug"])
        direction = article.get("direction")
        values = {
            "kind": ArticleKind.NEWS,
            "status": ArticleStatus.PUBLISHED,
            "direction": OrderWorkType(direction) if direction else None,
            "slug": article["slug"],
            "title": article["title"].strip(),
            "excerpt": article["excerpt"].strip(),
            "cover_image": cover,
            "tg_cover_image": cover,
            "og_image": cover,
            "content_html": article["content_html"],
            "meta_title": article["meta_title"].strip(),
            "meta_description": article["meta_description"].strip(),
            "meta_keywords": article["meta_keywords"].strip(),
            "published_at": datetime.fromisoformat(article["published_at"]),
        }
        tags = await self.tags.get_or_create_many(article["tags"])
        existing = await self.repo.get_by_slug(article["slug"])
        row = (
            await self.repo.update(existing, values, tags)
            if existing
            else await self.repo.create(values, tags)
        )

        legacy_id = article.get("legacy_id")
        if legacy_id is not None:
            await self.legacy.transfer(legacy_id, row)
        return existing is None
