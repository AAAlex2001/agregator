"Use case: реакции и просмотры статических новостей (отрицательные id)."

from datetime import UTC, datetime

from fastapi import HTTPException, status

from models.article_reaction import ReactionValue
from models.static_news_interaction import StaticNewsMetric
from services.articles.repository import StaticNewsInteractionRepository
from services.articles.use_cases.react_to_article import toggle_reaction


class StaticNewsInteractionsUseCase:
    def __init__(self, interactions: StaticNewsInteractionRepository) -> None:
        self.interactions = interactions

    async def read(
        self,
        news_id: int,
        visitor_key: str,
    ) -> tuple[StaticNewsMetric, ReactionValue | None]:
        self.validate_id(news_id)
        metrics = await self.interactions.get_metrics(news_id)
        reaction = await self.interactions.get_reaction(news_id, visitor_key)
        return metrics, ReactionValue(reaction.value) if reaction else None

    async def react(
        self,
        news_id: int,
        user_id: int | None,
        visitor_key: str,
        value: ReactionValue,
    ) -> tuple[StaticNewsMetric, ReactionValue | None]:
        self.validate_id(news_id)
        metrics = await self.interactions.get_metrics(news_id, for_update=True)
        reaction = await self.interactions.get_reaction(news_id, visitor_key)
        current = await toggle_reaction(
            reaction,
            value,
            add=lambda v: self.interactions.add_reaction(news_id, user_id, visitor_key, v),
            remove=lambda: self.interactions.remove_reaction(reaction),
            apply_delta=lambda v, delta: self.apply_delta(metrics, v, delta),
        )
        return metrics, current

    async def record_view(
        self,
        news_id: int,
        user_id: int | None,
        visitor_key: str,
    ) -> StaticNewsMetric:
        self.validate_id(news_id)
        metrics = await self.interactions.get_metrics(news_id, for_update=True)
        created = await self.interactions.add_view_once(
            news_id,
            user_id,
            visitor_key,
            datetime.now(UTC).date(),
        )
        if created:
            metrics.views_count = await self.interactions.increment_views(news_id)
        return metrics

    def validate_id(self, news_id: int) -> None:
        if news_id >= 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Новость не найдена")

    def apply_delta(self, metrics: StaticNewsMetric, value: str, delta: int) -> None:
        if value == ReactionValue.LIKE:
            metrics.likes_count += delta
        else:
            metrics.dislikes_count += delta
