import re
from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User
from models.password_reset_code import PasswordResetCode
import random
from utils.passwords import hash_password


class ForgotPasswordService:
    def __init__(self, db: AsyncSession):
        self.db = db

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
    
    async def validate_user_exists(self, email: str | None, phone: str | None) -> User | None:
        user = None
        try:
            if email:
                user = await self.get_user_by_email(email)
            elif phone:
                user = await self.get_user_by_phone(phone)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ошибка при поиске пользователя",
            )
        return user
    
    def generate_reset_code(self) -> str:
        """Генерирует случайный код сброса пароля (6-значное число)"""
        code = random.randint(100000, 999999)
        return str(code) 



    
    async def create_reset_code(self, user_id: int) -> str:
        """Создает новый код сброса пароля для пользователя"""
        code = self.generate_reset_code()
        
        reset_code = PasswordResetCode(
            user_id=user_id,
            code=code
        )
        
        self.db.add(reset_code)
        await self.db.flush()
        
        return code
    
    async def verify_reset_code(self, user_id: int, code: str) -> PasswordResetCode | None:
        """Проверяет код сброса пароля"""
        query = select(PasswordResetCode).where(
            PasswordResetCode.user_id == user_id,
            PasswordResetCode.code == code,
            PasswordResetCode.is_used == False,
            PasswordResetCode.expires_at > datetime.now(timezone.utc)
        )
        result = await self.db.execute(query)
        return result.scalars().first()
    
    async def mark_code_as_used(self, reset_code: PasswordResetCode):
        """Помечает код как использованный"""
        reset_code.is_used = True
    
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

    async def reset_password(self, user_id: int, code: str, new_password: str) -> bool:
        self.validate_password(new_password)

        reset_code = await self.verify_reset_code(user_id, code)
        if not reset_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный или истекший код сброса пароля",
            )

        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        user = result.scalars().first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )

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

        await self.mark_code_as_used(reset_code)

        return True
    
