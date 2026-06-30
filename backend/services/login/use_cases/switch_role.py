"Use case: switch role."
from fastapi import HTTPException, status

from models.session import Session
from models.user import UserRole
from services.login.repository import LoginRepository
from services.login.validators import LoginValidator


class SwitchRoleUseCase:
    "Переключает сессию на тот же email с другой ролью — после проверки пароля."

    def __init__(self, repo: LoginRepository, validator: LoginValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self,
        current_user_id: int,
        target_role: UserRole,
        password: str,
        current_session_id: str | None,
    ) -> Session:
        "Запускает основной сценарий use case."
        current = await self.repo.find_user_by_id(current_user_id)
        if current is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Сессия истекла",
            )
        if not current.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Переключение ролей доступно только для аккаунтов с привязанным email",
            )
        if target_role == current.role:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Вы уже в этой роли",
            )

        target = await self.repo.find_user_by_email_and_role(current.email, target_role)
        if target is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Аккаунт с такой ролью не найден на этом email",
            )

        if not await self.validator.verify_password(password, target.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный пароль",
            )

        if not target.email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "code": "email_not_verified",
                    "message": "Подтвердите почту для этой роли",
                    "email": target.email,
                    "role": target.role.value,
                },
            )

        if current.telegram_id is not None:
            await self.repo.set_telegram_id(target.id, current.telegram_id)

        if current_session_id:
            await self.repo.delete_session_by_uuid(current_session_id)
        return await self.repo.add_session(target.id)
