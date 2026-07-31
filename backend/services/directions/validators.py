"Бизнес-валидации для направлений."
from fastapi import HTTPException, status

from models.expert import Expert
from services.directions.registry import Direction, get_direction
from services.directions.repository import DirectionsRepository


class DirectionsValidator:
    "Проверка существования направления и принадлежности профиля исполнителю."

    def __init__(self, repo: DirectionsRepository) -> None:
        self.repo = repo

    def require_direction(self, key: str) -> Direction:
        "Возвращает направление или бросает 404."
        direction = get_direction(key)
        if direction is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Направление не найдено",
            )
        return direction

    async def require_expert(self, account_id: int) -> Expert:
        "Возвращает профиль исполнителя или бросает 403."
        expert = await self.repo.find_expert_by_account(account_id)
        if expert is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступно только исполнителю",
            )
        return expert
