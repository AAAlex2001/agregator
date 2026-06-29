
"Repository: доступ к БД для articles."
from typing import Any

from sqlalchemy import and_, delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.article import Article, ArticleKind, ArticleStatus
from models.article_comment import ArticleComment
from models.article_reaction import ArticleReaction, ReactionValue
from models.article_view import ArticleView
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

    async def get_published_by_id(self, article_id: int) -> Article | None:
        query = select(Article).where(Article.id == article_id, Article.status == ArticleStatus.PUBLISHED)
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

    async def get(self, article_id: int, user_id: int) -> ArticleReaction | None:
        query = select(ArticleReaction).where(
            ArticleReaction.article_id == article_id,
            ArticleReaction.user_id == user_id,
        )
        return (await self.db.execute(query)).scalar_one_or_none()

    async def add(self, article_id: int, user_id: int, value: ReactionValue) -> ArticleReaction:
        reaction = ArticleReaction(article_id=article_id, user_id=user_id, value=value)
        self.db.add(reaction)
        await self.db.flush()
        return reaction

    async def remove(self, article_id: int, user_id: int) -> None:
        await self.db.execute(
            delete(ArticleReaction).where(
                ArticleReaction.article_id == article_id,
                ArticleReaction.user_id == user_id,
            )
        )


class ArticleViewRepository:
    "Уникальные просмотры статей зарегистрированными пользователями."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def exists(self, article_id: int, user_id: int) -> bool:
        query = select(ArticleView.id).where(
            ArticleView.article_id == article_id,
            ArticleView.user_id == user_id,
        )
        return (await self.db.execute(query.limit(1))).scalar_one_or_none() is not None

    async def add(self, article_id: int, user_id: int) -> None:
        self.db.add(ArticleView(article_id=article_id, user_id=user_id))
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

    async def add(self, article_id: int, user_id: int, text: str, parent_id: int | None) -> ArticleComment:
        comment = ArticleComment(article_id=article_id, user_id=user_id, text=text, parent_id=parent_id)
        self.db.add(comment)
        await self.db.flush()
        return comment

    async def delete(self, comment: ArticleComment) -> None:
        await self.db.delete(comment)
