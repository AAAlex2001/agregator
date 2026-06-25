
"Repository: доступ к БД для articles."
from typing import Any

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.article import Article, ArticleKind, ArticleStatus


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
            query = query.where(Article.tags.contains([tag]))
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

    async def list_all(
        self,
        kind: ArticleKind | None,
        status: ArticleStatus | None,
        search: str | None,
        offset: int,
        limit: int,
    ) -> tuple[list[Article], int]:
        "Админская выборка: любые статусы, фильтры, пагинация. Возвращает строки и общее число."
        conditions = []
        if kind is not None:
            conditions.append(Article.kind == kind)
        if status is not None:
            conditions.append(Article.status == status)
        if search:
            like = f"%{search}%"
            conditions.append(or_(Article.title.ilike(like), Article.slug.ilike(like)))

        base = select(Article).where(and_(*conditions)) if conditions else select(Article)
        total = (await self.db.execute(select(func.count()).select_from(base.subquery()))).scalar_one()
        rows = (
            await self.db.execute(base.order_by(Article.updated_at.desc(), Article.id.desc()).offset(offset).limit(limit))
        ).scalars().all()
        return list(rows), int(total or 0)

    async def get_by_id(self, article_id: int) -> Article | None:
        return (await self.db.execute(select(Article).where(Article.id == article_id))).scalars().first()

    async def slug_exists(self, slug: str, exclude_id: int | None = None) -> bool:
        query = select(Article.id).where(Article.slug == slug)
        if exclude_id is not None:
            query = query.where(Article.id != exclude_id)
        return (await self.db.execute(query.limit(1))).scalar_one_or_none() is not None

    async def create(self, values: dict[str, Any]) -> Article:
        article = Article(**values)
        self.db.add(article)
        await self.db.flush()
        return article

    async def update(self, article: Article, values: dict[str, Any]) -> Article:
        for key, value in values.items():
            setattr(article, key, value)
        await self.db.flush()
        return article

    async def delete(self, article: Article) -> None:
        await self.db.delete(article)
