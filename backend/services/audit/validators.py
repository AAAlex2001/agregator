"""Бизнес-валидации аудита СУПБ."""
from fastapi import HTTPException, status

from models.account import Account, UserRole
from models.customer import Customer
from models.expert import Expert
from services.audit.repository import AuditRepository


class AuditValidator:
    """Проверяет, что анкету открывает пользователь подходящей роли."""

    def __init__(self, repo: AuditRepository) -> None:
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
                detail="Анкета аудитора доступна только исполнителю",
            )
        return account.expert_profile

    @staticmethod
    def require_customer(account: Account) -> Customer:
        """Возвращает профиль заказчика или бросает 403."""
        if account.role is not UserRole.CUSTOMER or account.customer_profile is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Анкета заказчика по аудиту доступна только заказчику",
            )
        return account.customer_profile
