from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.user import User


class ForgotPasswordRepository:
    "Все обращения к БД для сценария «забыли пароль»."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_user_by_email(self, email: str) -> User | None:
        return (
            await self.db.execute(select(User).where(User.email == email))
        ).scalars().first()

    async def find_user_by_phone(self, phone: str) -> User | None:
        return (
            await self.db.execute(select(User).where(User.phone == phone))
        ).scalars().first()

    async def list_users_by_email(self, email: str) -> list[User]:
        result = await self.db.execute(select(User).where(User.email == email))
        return list(result.scalars().all())

    async def list_users_by_phone(self, phone: str) -> list[User]:
        result = await self.db.execute(select(User).where(User.phone == phone))
        return list(result.scalars().all())
