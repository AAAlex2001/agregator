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

    async def get_user_by_email(self, email: str) -> User | None:
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_user_by_phone(self, phone: str) -> User | None:
        query = select(User).where(User.phone == phone)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_user_by_inn(self, inn: str) -> User | None:
        query = select(User).where(User.inn == inn)
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

        existing_by_inn = await self.get_user_by_inn(data.inn)
        if existing_by_inn:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким ИНН уже зарегистрирован",
            )

        if data.email:
            existing = await self.get_user_by_email(data.email)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Пользователь с таким email уже зарегистрирован",
                )

        if data.phone:
            existing = await self.get_user_by_phone(data.phone)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Пользователь с таким номером уже зарегистрирован",
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
