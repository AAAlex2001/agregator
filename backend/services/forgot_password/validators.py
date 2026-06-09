"Бизнес-валидации для forgot_password."
import re

from fastapi import HTTPException, status

from models.user import User
from services.forgot_password.repository import ForgotPasswordRepository


class ForgotPasswordValidator:
    "Валидация контакта (email/phone), пароля и поиск пользователя."

    def __init__(self, repo: ForgotPasswordRepository) -> None:
        self.repo = repo

    @staticmethod
    def ensure_contact_provided(email: str | None, phone: str | None) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if email or phone:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Необходимо указать email или телефон",
        )

    @staticmethod
    def ensure_password_strong(password: str) -> None:
        "Бросает HTTPException, если условие не выполнено."
        errors = []
        if len(password) < 6:
            errors.append("Не менее 6 символов")
        if not re.search(r"[A-Z]", password):
            errors.append("Хотя бы одна заглавная буква")
        if not re.search(r"[a-z]", password):
            errors.append("Хотя бы одна строчная буква")
        if not re.match(r'^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?`~ ]+$', password):
            errors.append("Только латинские буквы, цифры и спецсимволы")
        if errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пароль не соответствует требованиям: " + "; ".join(errors),
            )

    async def require_user(self, email: str | None, phone: str | None) -> User:
        "Возвращает требуемую сущность или бросает 404."
        self.ensure_contact_provided(email, phone)
        user: User | None = None
        if email:
            user = await self.repo.find_user_by_email(email)
        elif phone:
            user = await self.repo.find_user_by_phone(phone)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        return user
