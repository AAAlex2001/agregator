"""Бизнес-валидации НИР."""
from fastapi import HTTPException, status

from models.account import Account, UserRole
from models.expert import Expert
from services.research.repository import ResearchRepository


class ResearchValidator:
    """Проверяет, что анкету открывает исполнитель со своим профилем роли."""

    def __init__(self, repo: ResearchRepository) -> None:
        self.repo = repo

    async def require_account(self, account_id: int) -> Account:
        """Возвращает аккаунт или бросает 404."""
        account = await self.repo.find_account(account_id)
        if account is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        return account

    @staticmethod
    def require_expert(account: Account) -> Expert:
        """Возвращает профиль исполнителя или бросает 403."""
        if account.role is not UserRole.EXPERT or account.expert_profile is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Анкета исполнителя НИР доступна только исполнителю",
            )
        return account.expert_profile
