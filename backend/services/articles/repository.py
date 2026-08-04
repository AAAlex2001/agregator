
"Repository: доступ к БД для articles."
from datetime import UTC, date, datetime
from typing import Any

from sqlalchemy import and_, delete, select, update
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.article import Article, ArticleKind, ArticleStatus
from models.article_comment import ArticleComment
from models.article_reaction import ArticleReaction, ReactionValue
from models.article_view import ArticleView
from models.static_news_interaction import StaticNewsMetric, StaticNewsReaction, StaticNewsView
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
    ) -> tuple[list[Article], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = select(Article).where(
            and_(Article.kind == kind, Article.status == ArticleStatus.PUBLISHED)
        )
        if tag:
            query = query.where(Article.tags.any(Tag.name == tag))
        query = query.order_by(Article.published_at.desc(), Article.id.desc())
        return await paginate_with_has_more(self.db, query, skip, limit)

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
        reaction = ArticleReaction(article_id=article_id, user_id=user_id, visitor_key=visitor_key or "", value=value)
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


class StaticNewsInteractionRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_metrics(self, news_id: int, for_update: bool = False) -> StaticNewsMetric:
        await self.db.execute(
            pg_insert(StaticNewsMetric)
            .values(news_id=news_id, likes_count=0, dislikes_count=0, views_count=0)
            .on_conflict_do_nothing(index_elements=["news_id"])
        )
        query = select(StaticNewsMetric).where(StaticNewsMetric.news_id == news_id)
        if for_update:
            query = query.with_for_update()
        return (await self.db.execute(query)).scalar_one()

    async def list_metrics(self, news_ids: list[int]) -> list[StaticNewsMetric]:
        if not news_ids:
            return []
        query = select(StaticNewsMetric).where(StaticNewsMetric.news_id.in_(news_ids))
        return list((await self.db.execute(query)).scalars().all())

    async def get_reaction(
        self,
        news_id: int,
        visitor_key: str,
    ) -> StaticNewsReaction | None:
        query = select(StaticNewsReaction).where(
            StaticNewsReaction.news_id == news_id,
            StaticNewsReaction.visitor_key == visitor_key,
        )
        return (await self.db.execute(query)).scalar_one_or_none()

    async def add_reaction(
        self,
        news_id: int,
        user_id: int | None,
        visitor_key: str,
        value: str,
    ) -> StaticNewsReaction:
        reaction = StaticNewsReaction(
            news_id=news_id,
            user_id=user_id,
            visitor_key=visitor_key,
            value=value,
        )
        self.db.add(reaction)
        await self.db.flush()
        return reaction

    async def remove_reaction(self, reaction: StaticNewsReaction) -> None:
        await self.db.delete(reaction)

    async def add_view_once(
        self,
        news_id: int,
        user_id: int | None,
        visitor_key: str,
        viewed_on: date,
    ) -> bool:
        query = (
            pg_insert(StaticNewsView)
            .values(
                news_id=news_id,
                user_id=user_id,
                visitor_key=visitor_key,
                viewed_on=viewed_on,
                created_at=datetime.now(UTC),
            )
            .on_conflict_do_nothing(index_elements=["news_id", "visitor_key", "viewed_on"])
            .returning(StaticNewsView.id)
        )
        return (await self.db.execute(query)).scalar_one_or_none() is not None

    async def increment_views(self, news_id: int) -> int:
        query = (
            update(StaticNewsMetric)
            .where(StaticNewsMetric.news_id == news_id)
            .values(views_count=StaticNewsMetric.views_count + 1)
            .returning(StaticNewsMetric.views_count)
        )
        return (await self.db.execute(query)).scalar_one()


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
