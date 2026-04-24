from fastapi import HTTPException, status

from models.user import User, UserRole
from services.responses.repository import ResponseRepository


class ResponseValidator:
    "Проверяет участников (эксперт/заказчик/актёр). Работает только с репозиторием."

    def __init__(self, repo: ResponseRepository):
        self.repo = repo

    async def ensure_expert(self, expert_id: int) -> User:
        user = await self.require_user(expert_id)
        if user.is_active and user.role == UserRole.EXPERT:
            return user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для откликов",
        )

    async def ensure_customer(self, customer_id: int) -> User:
        user = await self.require_user(customer_id)
        if user.is_active and user.role == UserRole.CUSTOMER:
            return user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для откликов",
        )

    async def get_actor(self, user_id: int) -> User:
        user = await self.require_user(user_id)
        if user.is_active:
            return user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Пользователь неактивен",
        )

    async def require_user(self, user_id: int) -> User:
        user = await self.repo.find_user(user_id)
        if user is not None:
            return user
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )
