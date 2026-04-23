import re

from fastapi import BackgroundTasks, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.user import User
from services.verification import VerificationService
from utils.passwords import hash_password

RESET_CODE_SUBJECT = "Сброс пароля на Ресурс-Плюс"


class ForgotPasswordService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.verification = VerificationService(db)

    def validate_contact(self, email: str | None, phone: str | None) -> None:
        if not email and not phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Необходимо указать email или телефон",
            )

    def validate_password(self, password: str) -> None:
        errors = []
        if len(password) < 6:
            errors.append("Не менее 6 символов")
        if not re.search(r'[A-Z]', password):
            errors.append("Хотя бы одна заглавная буква")
        if not re.search(r'[a-z]', password):
            errors.append("Хотя бы одна строчная буква")
        if not re.match(r'^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?`~ ]+$', password):
            errors.append("Только латинские буквы, цифры и спецсимволы")
        if errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пароль не соответствует требованиям: " + "; ".join(errors),
            )

    async def get_user_by_email(self, email: str) -> User | None:
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_user_by_phone(self, phone: str) -> User | None:
        query = select(User).where(User.phone == phone)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_all_users_by_email(self, email: str) -> list[User]:
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_all_users_by_phone(self, phone: str) -> list[User]:
        query = select(User).where(User.phone == phone)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def find_user(self, email: str | None, phone: str | None) -> User:
        self.validate_contact(email, phone)
        user: User | None = None
        if email:
            user = await self.get_user_by_email(email)
        elif phone:
            user = await self.get_user_by_phone(phone)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        return user

    async def send_reset_code(self, email: str | None, phone: str | None) -> User:
        user = await self.find_user(email, phone)
        if email:
            await self.verification.send_code_to_email(user.id, email, RESET_CODE_SUBJECT)
        return user

    async def schedule_reset_code(
        self,
        email: str | None,
        phone: str | None,
        background_tasks: BackgroundTasks,
    ) -> User:
        "Выпускает код и отправляет письмо в фоне — клиент не ждёт SMTP."
        user = await self.find_user(email, phone)
        if email:
            await self.verification.schedule_code_email(
                user.id,
                email,
                RESET_CODE_SUBJECT,
                background_tasks,
            )
        return user

    async def verify_code(self, email: str | None, phone: str | None, code: str) -> User:
        user = await self.find_user(email, phone)
        await self.verification.ensure_code_valid(user.id, code)
        return user

    async def reset_password(
        self,
        email: str | None,
        phone: str | None,
        code: str,
        new_password: str,
    ) -> User:
        self.validate_password(new_password)
        user = await self.find_user(email, phone)
        await self.verification.consume_code(user.id, code)

        hashed = await hash_password(new_password)
        user.password = hashed

        siblings: list[User] = []
        if user.email:
            siblings = await self.get_all_users_by_email(user.email)
        elif user.phone:
            siblings = await self.get_all_users_by_phone(user.phone)
        for sibling in siblings:
            if sibling.id != user.id:
                sibling.password = hashed

        return user
