from typing import Optional

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.article import Article, ArticleKind, ArticleStatus


class ArticleRepository:
    "Все SQL-запросы по статьям. Никакой бизнес-логики."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_published(
        self,
        kind: ArticleKind,
        skip: int,
        limit: int,
        tag: Optional[str],
    ) -> tuple[list[Article], bool]:
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
