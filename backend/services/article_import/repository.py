"Перенос лайков, дизлайков и просмотров статичных новостей старого фронта на статьи в БД."

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.article import Article
from models.article_reaction import ArticleReaction, ReactionValue
from models.article_view import ArticleView
from models.static_news_interaction import StaticNewsMetric, StaticNewsReaction, StaticNewsView


class LegacyNewsRepository:
    "Счётчики и голоса по отрицательным id новостей; после переноса записи удаляются, повтор их не найдёт."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def transfer(self, legacy_id: int, article: Article) -> bool:
        "Переносит метрики, голоса и просмотры на статью. False — переносить уже нечего."
        metric = await self.db.get(StaticNewsMetric, legacy_id)
        if metric is None:
            return False

        reactions = (
            (await self.db.execute(select(StaticNewsReaction).where(StaticNewsReaction.news_id == legacy_id)))
            .scalars()
            .all()
        )
        if reactions:
            await self.db.execute(
                pg_insert(ArticleReaction)
                .values(
                    [
                        {
                            "article_id": article.id,
                            "user_id": reaction.user_id,
                            "visitor_key": reaction.visitor_key,
                            "value": ReactionValue(reaction.value),
                            "created_at": reaction.created_at,
                        }
                        for reaction in reactions
                    ]
                )
                .on_conflict_do_nothing(index_elements=["article_id", "visitor_key"])
            )

        views = (
            (await self.db.execute(select(StaticNewsView).where(StaticNewsView.news_id == legacy_id)))
            .scalars()
            .all()
        )
        self.db.add_all(
            ArticleView(
                article_id=article.id,
                user_id=view.user_id,
                visitor_key=view.visitor_key,
                created_at=view.created_at,
            )
            for view in views
        )

        article.likes_count += metric.likes_count
        article.dislikes_count += metric.dislikes_count
        article.views_count += metric.views_count
        await self.db.delete(metric)
        await self.db.flush()
        return True
