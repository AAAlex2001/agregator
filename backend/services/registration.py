import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User, UserRole
from schemas.registration import UserRegistration
from fastapi import HTTPException, status
from utils.passwords import hash_password


class RegistrationService:
    def __init__(self, db: AsyncSession):
        self.db = db

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

    async def get_user_by_email_and_role(self, email: str, role: UserRole) -> User | None:
        query = select(User).where(User.email == email, User.role == role)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_user_by_phone_and_role(self, phone: str, role: UserRole) -> User | None:
        query = select(User).where(User.phone == phone, User.role == role)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_user_by_inn_and_role(self, inn: str, role: UserRole) -> User | None:
        query = select(User).where(User.inn == inn, User.role == role)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_user(self, data: UserRegistration) -> User:
        self.validate_password(data.password)

        company_inn = None
        if data.company_data:
            company_inn = ((data.company_data.get("data") or {}).get("inn") if isinstance(data.company_data, dict) else None)
            if company_inn and company_inn != data.inn:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Выбранная компания не соответствует указанному ИНН",
                )

        existing_by_inn = await self.get_user_by_inn_and_role(data.inn, data.role)
        if existing_by_inn:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким ИНН и ролью уже зарегистрирован",
            )

        if data.email:
            existing = await self.get_user_by_email_and_role(data.email, data.role)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Пользователь с таким email и ролью уже зарегистрирован",
                )

        if data.phone:
            existing = await self.get_user_by_phone_and_role(data.phone, data.role)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Пользователь с таким номером и ролью уже зарегистрирован",
                )

        new_user = User(
            role=data.role,
            phone=data.phone,
            email=data.email,
            inn=data.inn,
            company_data=data.company_data,
            password=await hash_password(data.password),
            first_name=data.first_name,
            last_name=data.last_name,
        )

        self.db.add(new_user)
        await self.db.flush()

        return new_user
