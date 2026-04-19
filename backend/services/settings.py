from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.user import User
from schemas.settings import UserSettingsResponse
from utils.passwords import hash_password


class SettingsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_or_404(self, user_id: int) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        return user

    async def ensure_unique_phone(self, phone: str, role, user_id: int) -> None:
        existing = await self.db.execute(
            select(User).where(User.phone == phone, User.role == role, User.id != user_id)
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот номер телефона уже используется",
            )

    async def ensure_unique_email(self, email: str, role, user_id: int) -> None:
        existing = await self.db.execute(
            select(User).where(User.email == email, User.role == role, User.id != user_id)
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот email уже используется",
            )

    async def ensure_unique_inn(self, inn: str, role, user_id: int) -> None:
        existing = await self.db.execute(
            select(User).where(User.inn == inn, User.role == role, User.id != user_id)
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот ИНН уже используется",
            )

    async def update_password(self, user_id: int, new_password: str) -> None:
        user = await self.get_user_or_404(user_id)
        user.password = await hash_password(new_password)
        await self.db.flush()

    @staticmethod
    def to_response(user: User) -> UserSettingsResponse:
        return UserSettingsResponse(
            id=user.id,
            inn=user.inn,
            email=user.email,
            phone=user.phone,
            first_name=user.first_name,
            last_name=user.last_name,
            balance=user.balance or 0,
            rating=float(user.rating) if user.rating is not None else None,
            review_count=user.review_count or 0,
            role=user.role.value,
        )
