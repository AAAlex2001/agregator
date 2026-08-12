"""Бизнес-валидации проектирования."""
from fastapi import HTTPException, status

from models.account import Account, UserRole
from models.expert import Expert
from models.license_holder import LicenseHolder
from services.design.repository import DesignRepository


class DesignValidator:
    """Проверяет, что анкету открывает пользователь со своим профилем роли."""

    def __init__(self, repo: DesignRepository) -> None:
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
                detail="Анкета проектировщика доступна только исполнителю",
            )
        return account.expert_profile

    @staticmethod
    def require_license_holder(account: Account) -> LicenseHolder:
        """Возвращает профиль держателя или бросает 403."""
        if account.role is not UserRole.LICENSE_HOLDER or account.license_holder_profile is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Анкета члена СРО доступна только держателю разрешительных документов",
            )
        return account.license_holder_profile
