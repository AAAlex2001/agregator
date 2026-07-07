"Repository: доступ к БД для registration."
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import InstrumentedAttribute

from models.user import User
from models.user import UserRole as ModelUserRole
from schemas.registration import UserRole


class RegistrationRepository:
    "Все обращения к БД для регистрации (поиск занятых полей, создание пользователя)."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def is_field_taken(
        self, column: InstrumentedAttribute[str | None], value: str, role: UserRole
    ) -> bool:
        "Признак: соответствует ли сущность условию."
        result = await self.db.execute(
            select(User.id).where(column == value, User.role == ModelUserRole(role.value))
        )
        return result.first() is not None

    async def find_users_by_email(self, email: str, role: UserRole | None = None) -> list[User]:
        "Ищет сущность по заданным параметрам."
        query = select(User).where(User.email == email)
        if role is not None:
            query = query.where(User.role == ModelUserRole(role.value))
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def delete_unverified(self, email: str, role: UserRole) -> None:
        "Удаляет брошенную регистрацию: юзер с этим email+ролью, не подтвердивший почту."
        await self.db.execute(
            delete(User).where(
                User.email == email,
                User.role == ModelUserRole(role.value),
                User.email_verified.is_(False),
            )
        )
        await self.db.flush()

    async def add(self, user: User) -> None:
        "Добавляет сущность в сессию."
        self.db.add(user)
        await self.db.flush()
