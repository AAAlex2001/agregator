from datetime import UTC, datetime
from typing import Literal, cast

from fastapi import HTTPException, status

from models.rtn_clarification import RtnClarification
from services.articles.use_cases.react_to_article import toggle_reaction
from services.rtn.repository import (
    RtnClarificationReactionRepository,
    RtnClarificationViewRepository,
    RtnRepository,
)

ReactionValue = Literal["LIKE", "DISLIKE"]


class RtnClarificationInteractionsUseCase:
    def __init__(
        self,
        clarifications: RtnRepository,
        reactions: RtnClarificationReactionRepository,
        views: RtnClarificationViewRepository,
    ) -> None:
        self.clarifications = clarifications
        self.reactions = reactions
        self.views = views

    async def read(
        self,
        clarification_id: int,
        visitor_key: str,
    ) -> tuple[RtnClarification, ReactionValue | None]:
        clarification = await self.clarifications.get_published_by_id(clarification_id)
        if clarification is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Разъяснение не найдено")
        reaction = await self.reactions.get(clarification_id, visitor_key)
        return clarification, cast(ReactionValue, reaction.value) if reaction else None

    async def react(
        self,
        clarification_id: int,
        user_id: int | None,
        visitor_key: str,
        value: ReactionValue,
    ) -> tuple[RtnClarification, ReactionValue | None]:
        clarification = await self.get_for_update(clarification_id)
        reaction = await self.reactions.get(clarification_id, visitor_key)
        current = await toggle_reaction(
            reaction,
            value,
            add=lambda v: self.reactions.add(clarification_id, user_id, visitor_key, v),
            remove=lambda: self.reactions.remove(reaction),
            apply_delta=lambda v, delta: self.apply_delta(clarification, v, delta),
        )
        return clarification, current

    async def record_view(
        self,
        clarification_id: int,
        user_id: int | None,
        visitor_key: str,
    ) -> RtnClarification:
        clarification = await self.clarifications.get_published_by_id(clarification_id)
        if clarification is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Разъяснение не найдено")
        created = await self.views.add_once(
            clarification_id,
            user_id,
            visitor_key,
            datetime.now(UTC).date(),
        )
        if created:
            clarification.views_count = await self.clarifications.increment_views(
                clarification_id,
            )
        return clarification

    async def get_for_update(self, clarification_id: int) -> RtnClarification:
        clarification = await self.clarifications.get_published_by_id_for_update(clarification_id)
        if clarification is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Разъяснение не найдено")
        return clarification

    def apply_delta(self, clarification: RtnClarification, value: str, delta: int) -> None:
        if value == "LIKE":
            clarification.likes_count += delta
        else:
            clarification.dislikes_count += delta
