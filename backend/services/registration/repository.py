from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.user import User
from models.user import UserRole as ModelUserRole
from schemas.registration import UserRole


class RegistrationRepository:
    "Все обращения к БД для регистрации (поиск занятых полей, создание пользователя)."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def is_field_taken(self, column, value, role: UserRole) -> bool:
        result = await self.db.execute(
            select(User.id).where(column == value, User.role == ModelUserRole(role.value))
        )
        return result.first() is not None

    async def find_users_by_email(self, email: str, role: UserRole | None = None) -> list[User]:
        query = select(User).where(User.email == email)
        if role is not None:
            query = query.where(User.role == ModelUserRole(role.value))
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def add(self, user: User) -> None:
        self.db.add(user)
        await self.db.flush()
