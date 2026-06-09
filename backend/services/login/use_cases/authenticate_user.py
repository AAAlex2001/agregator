"Use case: authenticate user."
from fastapi import HTTPException, status

from models.user import User
from schemas.login import UserLogin
from services.login.repository import LoginRepository
from services.login.validators import LoginValidator
from services.registration.disposable_email_domains import ensure_email_not_disposable


class AuthenticateUserUseCase:
    "Подбирает юзера по email/phone/inn, проверяет пароль и роль."

    def __init__(self, repo: LoginRepository, validator: LoginValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, data: UserLogin) -> User:
        "Запускает основной сценарий use case."
        self.validator.ensure_contact_provided(data.email, data.phone, data.inn)
        self.validator.ensure_inn_format(data.inn)
        ensure_email_not_disposable(data.email)

        candidates = await self.find_candidates(data)
        if not candidates:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email/телефон или пароль",
            )

        matched = [
            candidate
            for candidate in candidates
            if await self.validator.verify_password(data.password, candidate.password)
        ]

        if not matched:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email/телефон или пароль",
            )

        if data.role is not None:
            matched = [u for u in matched if u.role == data.role]
            if not matched:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Под этими данными нет аккаунта с указанной ролью",
                )

        if len(matched) > 1:
            available = sorted({u.role.value for u in matched})
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "code": "role_choice_required",
                    "message": "Выберите роль для входа",
                    "available_roles": available,
                },
            )

        user = matched[0]
        if not user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "code": "email_not_verified",
                    "message": "Подтвердите почту — код был отправлен при регистрации",
                    "email": user.email,
                    "role": user.role.value,
                },
            )

        return user

    async def find_candidates(self, data: UserLogin) -> list[User]:
        "Ищет сущность по заданным параметрам."
        if data.email:
            return await self.repo.find_users_by_email(data.email)
        if data.inn:
            return await self.repo.find_users_by_inn(data.inn)
        if data.phone:
            return await self.repo.find_users_by_phone(data.phone)
        return []
