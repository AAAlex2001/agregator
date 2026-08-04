"Бизнес-валидации для forgot_password."
from fastapi import HTTPException, status

from models.account import Account
from services.forgot_password.repository import ForgotPasswordRepository
from utils.passwords import ensure_password_strong


class ForgotPasswordValidator:
    "Валидация контакта (email/phone), пароля и поиск пользователя."

    def __init__(self, repo: ForgotPasswordRepository) -> None:
        self.repo = repo

    ensure_password_strong = staticmethod(ensure_password_strong)

    @staticmethod
    def ensure_contact_provided(email: str | None, phone: str | None) -> None:
        "Бросает HTTPException, если условие не выполнено."
        if email or phone:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Необходимо указать email или телефон",
        )

    async def require_user(self, email: str | None, phone: str | None) -> Account:
        "Возвращает требуемую сущность или бросает 404."
        self.ensure_contact_provided(email, phone)
        user: Account | None = None
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
