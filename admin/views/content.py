"Админ-вьюшка контентного раздела: новости и статьи блога с редактором HTML."

import json
from datetime import UTC, datetime
from typing import Any

from sqladmin import ModelView
from starlette.requests import Request

from integrations.backend_client import notify_blog_published
from models import Article, ArticleKind, ArticleStatus


class ArticleAdmin(ModelView, model=Article):
    "Статьи блога и новости: WYSIWYG-редактор, теги в JSON-формате, SEO-поля и автодата публикации."

    name = "Статья"
    name_plural = "Контент · Новости и блог"
    icon = "fa-solid fa-newspaper"
    category = "Контент"

    create_template = "article_edit.html"
    edit_template = "article_edit.html"

    column_list = [
        Article.id,
        Article.kind,
        Article.status,
        Article.title,
        Article.slug,
        Article.published_at,
        Article.updated_at,
    ]
    column_searchable_list = [Article.title, Article.slug]
    column_sortable_list = [Article.id, Article.kind, Article.status, Article.published_at, Article.updated_at]
    column_default_sort = [(Article.published_at, True), (Article.id, True)]

    column_details_list = [
        Article.id, Article.kind, Article.status,
        Article.slug, Article.title, Article.excerpt, Article.cover_image,
        Article.tags, Article.content_html,
        Article.meta_title, Article.meta_description, Article.meta_keywords, Article.og_image,
        Article.published_at, Article.created_at, Article.updated_at,
    ]

    form_columns = [
        Article.kind, Article.status,
        Article.slug, Article.title, Article.excerpt,
        Article.cover_image, Article.tags, Article.content_html,
        Article.meta_title, Article.meta_description, Article.meta_keywords, Article.og_image,
        Article.published_at,
    ]

    column_labels = {
        Article.id: "ID",
        Article.kind: "Тип (новость/блог)",
        Article.status: "Статус",
        Article.slug: "Slug (URL)",
        Article.title: "Заголовок",
        Article.excerpt: "Краткое описание",
        Article.cover_image: "Обложка (URL)",
        Article.tags: "Теги",
        Article.content_html: "HTML-контент",
        Article.meta_title: "SEO · meta title",
        Article.meta_description: "SEO · meta description",
        Article.meta_keywords: "SEO · meta keywords",
        Article.og_image: "SEO · OpenGraph image (URL)",
        Article.published_at: "Опубликовать с (UTC)",
        Article.created_at: "Создана",
        Article.updated_at: "Обновлена",
    }

    column_formatters = {
        Article.kind: lambda m, a: str(m.kind),
        Article.status: lambda m, a: str(m.status),
    }
    column_formatters_detail = {
        Article.kind: lambda m, a: str(m.kind),
        Article.status: lambda m, a: str(m.status),
    }

    async def on_model_change(self, data: dict[str, Any], model: Article, is_created: bool, request: Request) -> None:
        "Нормализует теги (JSON-строка → список), приводит slug к нижнему регистру и выставляет дату публикации."
        raw_tags = data.get("tags")
        if isinstance(raw_tags, str):
            cleaned = raw_tags.strip()
            try:
                data["tags"] = json.loads(cleaned) if cleaned else []
            except json.JSONDecodeError:
                data["tags"] = []
        elif raw_tags is None:
            data["tags"] = []
        elif not isinstance(raw_tags, list):
            data["tags"] = list(raw_tags)

        slug = (data.get("slug") or "").strip().lower().replace(" ", "-")
        if slug:
            data["slug"] = slug

        status = data.get("status")
        if status and str(status).upper().endswith("PUBLISHED") and not data.get("published_at"):
            data["published_at"] = datetime.now(UTC)

    async def after_model_change(
        self, data: dict[str, Any], model: Article, is_created: bool, request: Request
    ) -> None:
        "Если статья переходит в PUBLISHED — дёргает backend для рассылки in-app + email подписчикам."
        if model.kind != ArticleKind.BLOG:
            return
        if model.status != ArticleStatus.PUBLISHED:
            return
        notify_blog_published(slug=model.slug, title=model.title, preview=model.excerpt or "")
