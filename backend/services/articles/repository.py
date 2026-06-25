
"Repository: доступ к БД для articles."
from typing import Any

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.article import Article, ArticleKind, ArticleStatus
from models.tag import Tag


class ArticleRepository:
    "Все SQL-запросы по статьям. Никакой бизнес-логики."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_published(
        self,
        kind: ArticleKind,
        skip: int,
        limit: int,
        tag: str | None,
    ) -> tuple[list[Article], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = select(Article).where(
            and_(Article.kind == kind, Article.status == ArticleStatus.PUBLISHED)
        )
        if tag:
            query = query.where(Article.tags.any(Tag.name == tag))
        query = query.order_by(Article.published_at.desc(), Article.id.desc()).offset(skip).limit(limit + 1)

        rows = list((await self.db.execute(query)).scalars().all())
        has_more = len(rows) > limit
        return rows[:limit], has_more

    async def get_published_by_slug(self, slug: str) -> Article | None:
        "Возвращает запрошенную сущность."
        query = select(Article).where(
            and_(Article.slug == slug, Article.status == ArticleStatus.PUBLISHED)
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_related(
        self,
        kind: ArticleKind,
        exclude_id: int,
        limit: int,
    ) -> list[Article]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = (
            select(Article)
            .where(
                and_(
                    Article.kind == kind,
                    Article.status == ArticleStatus.PUBLISHED,
                    Article.id != exclude_id,
                )
            )
            .order_by(Article.published_at.desc(), Article.id.desc())
            .limit(limit)
        )
        return list((await self.db.execute(query)).scalars().all())

    async def list_all(self, kind: ArticleKind | None, status: ArticleStatus | None) -> list[Article]:
        "Админская выборка: любые статусы, фильтр по типу/статусу, весь список без пагинации."
        conditions = []
        if kind is not None:
            conditions.append(Article.kind == kind)
        if status is not None:
            conditions.append(Article.status == status)
        query = select(Article)
        if conditions:
            query = query.where(and_(*conditions))
        query = query.order_by(Article.updated_at.desc(), Article.id.desc())
        return list((await self.db.execute(query)).scalars().all())

    async def get_by_id(self, article_id: int) -> Article | None:
        return (await self.db.execute(select(Article).where(Article.id == article_id))).scalars().first()

    async def slug_exists(self, slug: str, exclude_id: int | None = None) -> bool:
        query = select(Article.id).where(Article.slug == slug)
        if exclude_id is not None:
            query = query.where(Article.id != exclude_id)
        return (await self.db.execute(query.limit(1))).scalar_one_or_none() is not None

    async def create(self, values: dict[str, Any], tags: list[Tag]) -> Article:
        article = Article(**values, tags=tags)
        self.db.add(article)
        await self.db.flush()
        return article

    async def update(self, article: Article, values: dict[str, Any], tags: list[Tag]) -> Article:
        for key, value in values.items():
            setattr(article, key, value)
        article.tags = tags
        await self.db.flush()
        return article

    async def delete(self, article: Article) -> None:
        await self.db.delete(article)
