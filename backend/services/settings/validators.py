"Бизнес-валидации для settings."
from fastapi import HTTPException, status

from models.account import Account, UserRole
from models.expert import Expert
from models.license_holder import LicenseHolder
from services.settings.repository import SettingsRepository


class SettingsValidator:
    "Проверка прав и уникальности полей в рамках текущей роли."

    def __init__(self, repo: SettingsRepository) -> None:
        self.repo = repo

    async def require_user(self, user_id: int) -> Account:
        "Возвращает требуемую сущность или бросает 404."
        user = await self.repo.find_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        return user

    async def require_license_holder(self, user_id: int) -> Account:
        "Возвращает требуемую сущность или бросает 404."
        user = await self.require_user(user_id)
        if user.role != UserRole.LICENSE_HOLDER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступно только держателю лицензии",
            )
        return user

    async def require_expert(self, user_id: int) -> Account:
        """Разрешает изменять экспертные настройки только эксперту."""
        user = await self.require_user(user_id)
        if user.role != UserRole.EXPERT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступно только эксперту",
            )
        return user

    def require_expert_profile(self, account: Account) -> Expert:
        "Возвращает профиль эксперта аккаунта или бросает 409, если профиль не создан."
        if account.expert_profile is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Профиль роли не найден",
            )
        return account.expert_profile

    def require_license_holder_profile(self, account: Account) -> LicenseHolder:
        "Возвращает профиль держателя лицензии аккаунта или бросает 409, если профиль не создан."
        if account.license_holder_profile is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Профиль роли не найден",
            )
        return account.license_holder_profile

    async def ensure_unique_phone(self, phone: str, user_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if await self.repo.field_taken_in_same_role(Account.phone, phone, user_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот номер уже используется для текущей роли",
            )

    async def ensure_unique_email(self, email: str, user_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if await self.repo.field_taken_in_same_role(Account.email, email, user_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот email уже используется для текущей роли",
            )

    async def ensure_unique_inn(self, inn: str, user_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if await self.repo.field_taken_in_same_role(Account.inn, inn, user_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот ИНН уже используется для текущей роли",
            )
