"Repository: доступ к БД для articles."

from datetime import datetime
from typing import Any

from sqlalchemy import and_, case, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.article import Article, ArticleKind, ArticleStatus
from models.article_comment import ArticleComment
from models.article_reaction import ArticleReaction, ReactionValue
from models.article_view import ArticleView
from models.order import OrderWorkType
from models.tag import Tag
from utils.pagination import paginate_with_has_more


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
        direction: OrderWorkType | None = None,
    ) -> tuple[list[Article], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = select(Article).where(and_(Article.kind == kind, Article.status == ArticleStatus.PUBLISHED))
        if tag:
            query = query.where(Article.tags.any(Tag.name == tag))
        if direction is not None:
            query = query.where(Article.direction == direction)
        query = query.order_by(Article.published_at.desc(), Article.id.desc())
        return await paginate_with_has_more(self.db, query, skip, limit)

    async def list_published_sitemap(self, kind: ArticleKind) -> list[tuple[str, datetime | None, datetime]]:
        "Slug и даты всех опубликованных статей типа — для карты сайта."
        query = (
            select(Article.slug, Article.published_at, Article.updated_at)
            .where(and_(Article.kind == kind, Article.status == ArticleStatus.PUBLISHED))
            .order_by(Article.published_at.desc(), Article.id.desc())
        )
        return list((await self.db.execute(query)).tuples().all())

    async def get_published_by_slug(self, slug: str) -> Article | None:
        "Возвращает запрошенную сущность."
        query = select(Article).where(and_(Article.slug == slug, Article.status == ArticleStatus.PUBLISHED))
        return (await self.db.execute(query)).scalars().first()

    async def get_by_slug(self, slug: str) -> Article | None:
        "Статья по slug в любом статусе — для импорта из файлов."
        return (await self.db.execute(select(Article).where(Article.slug == slug))).scalars().first()

    async def list_related(
        self,
        kind: ArticleKind,
        exclude_id: int,
        limit: int,
        direction: OrderWorkType | None = None,
    ) -> list[Article]:
        "Свежие статьи того же типа; статьи того же направления идут первыми."
        query = select(Article).where(
            and_(
                Article.kind == kind,
                Article.status == ArticleStatus.PUBLISHED,
                Article.id != exclude_id,
            )
        )
        if direction is not None:
            query = query.order_by(case((Article.direction == direction, 0), else_=1))
        query = query.order_by(Article.published_at.desc(), Article.id.desc()).limit(limit)
        return list((await self.db.execute(query)).scalars().all())

    async def list_all(
        self,
        kind: ArticleKind | None,
        status: ArticleStatus | None,
        query: str | None,
        with_comments: bool,
        views_order: str | None,
        skip: int,
        limit: int,
    ) -> tuple[list[Article], int]:
        "Админская выборка: фильтры по типу, статусу и обсуждениям, поиск, порядок по просмотрам или по изменению."
        conditions = []
        if kind is not None:
            conditions.append(Article.kind == kind)
        if status is not None:
            conditions.append(Article.status == status)
        if query:
            pattern = f"%{query.strip()}%"
            conditions.append(or_(Article.title.ilike(pattern), Article.slug.ilike(pattern)))
        if with_comments:
            conditions.append(
                select(ArticleComment.id).where(ArticleComment.article_id == Article.id).exists()
            )
        base = select(Article).where(*conditions)
        total = (await self.db.execute(select(func.count()).select_from(base.subquery()))).scalar_one()
        if views_order == "desc":
            order = Article.views_count.desc()
        elif views_order == "asc":
            order = Article.views_count.asc()
        else:
            order = Article.updated_at.desc()
        page = base.order_by(order, Article.id.desc()).offset(skip).limit(limit)
        return list((await self.db.execute(page)).scalars().all()), total

    async def get_by_id(self, article_id: int) -> Article | None:
        return (await self.db.execute(select(Article).where(Article.id == article_id))).scalars().first()

    async def get_published_by_id(self, article_id: int) -> Article | None:
        query = select(Article).where(Article.id == article_id, Article.status == ArticleStatus.PUBLISHED)
        return (await self.db.execute(query)).scalars().first()

    async def get_published_by_id_for_update(self, article_id: int) -> Article | None:
        query = (
            select(Article)
            .where(Article.id == article_id, Article.status == ArticleStatus.PUBLISHED)
            .with_for_update()
        )
        return (await self.db.execute(query)).scalars().first()

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


class ArticleReactionRepository:
    "Голоса 👍/👎 по статьям. Источник правды; счётчики на articles обновляет use case."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self, article_id: int, visitor_key: str) -> ArticleReaction | None:
        query = select(ArticleReaction).where(
            ArticleReaction.article_id == article_id,
            ArticleReaction.visitor_key == visitor_key,
        )
        return (await self.db.execute(query)).scalar_one_or_none()

    async def add(
        self,
        article_id: int,
        user_id: int | None,
        visitor_key: str | None,
        value: ReactionValue,
    ) -> ArticleReaction:
        reaction = ArticleReaction(
            article_id=article_id, user_id=user_id, visitor_key=visitor_key or "", value=value
        )
        self.db.add(reaction)
        await self.db.flush()
        return reaction

    async def remove(self, article_id: int, visitor_key: str) -> None:
        query = delete(ArticleReaction).where(
            ArticleReaction.article_id == article_id,
            ArticleReaction.visitor_key == visitor_key,
        )
        await self.db.execute(query)


class ArticleViewRepository:
    "Уникальные просмотры статей зарегистрированными пользователями."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_recent(self, article_id: int, visitor_key: str, since: datetime) -> bool:
        query = select(ArticleView.id).where(
            ArticleView.article_id == article_id,
            ArticleView.visitor_key == visitor_key,
            ArticleView.created_at >= since,
        )
        return (await self.db.execute(query.limit(1))).scalar_one_or_none() is not None

    async def add(self, article_id: int, user_id: int | None, visitor_key: str) -> None:
        self.db.add(ArticleView(article_id=article_id, user_id=user_id, visitor_key=visitor_key))
        await self.db.flush()


class ArticleCommentRepository:
    "Комментарии к статьям. user грузится сразу (lazy=selectin) — для имени автора."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_article(self, article_id: int) -> list[ArticleComment]:
        query = (
            select(ArticleComment)
            .where(ArticleComment.article_id == article_id)
            .order_by(ArticleComment.created_at.asc(), ArticleComment.id.asc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def get_by_id(self, comment_id: int) -> ArticleComment | None:
        return (
            await self.db.execute(select(ArticleComment).where(ArticleComment.id == comment_id))
        ).scalar_one_or_none()

    async def add(
        self,
        article_id: int,
        user_id: int | None,
        visitor_key: str | None,
        text: str,
        parent_id: int | None,
    ) -> ArticleComment:
        comment = ArticleComment(
            article_id=article_id,
            user_id=user_id,
            visitor_key=visitor_key or "",
            text=text,
            parent_id=parent_id,
        )
        self.db.add(comment)
        await self.db.flush()
        return comment

    async def delete(self, comment: ArticleComment) -> None:
        await self.db.delete(comment)
