"Бизнес-валидации для settings."
from fastapi import HTTPException, status

from models.user import User, UserRole
from services.settings.repository import SettingsRepository


class SettingsValidator:
    "Проверка прав и уникальности полей в рамках текущей роли."

    def __init__(self, repo: SettingsRepository) -> None:
        self.repo = repo

    async def get_user_or_404(self, user_id: int) -> User:
        "Возвращает запрошенную сущность."
        user = await self.repo.find_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        return user

    async def require_license_holder(self, user_id: int) -> User:
        "Возвращает требуемую сущность или бросает 404."
        user = await self.get_user_or_404(user_id)
        if user.role != UserRole.LICENSE_HOLDER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступно только держателю лицензии",
            )
        return user

    async def ensure_unique_phone(self, phone: str, user_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if await self.repo.field_taken_in_same_role(User.phone, phone, user_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот номер уже используется для текущей роли",
            )

    async def ensure_unique_email(self, email: str, user_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if await self.repo.field_taken_in_same_role(User.email, email, user_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот email уже используется для текущей роли",
            )

    async def ensure_unique_inn(self, inn: str, user_id: int) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if await self.repo.field_taken_in_same_role(User.inn, inn, user_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот ИНН уже используется для текущей роли",
            )
