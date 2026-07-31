"Repository: доступ к БД для registration."
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import InstrumentedAttribute

from models.account import Account
from models.account import UserRole as ModelUserRole
from models.base import Base
from schemas.registration import UserRole


class RegistrationRepository:
    "Все обращения к БД для регистрации (поиск занятых полей, создание аккаунта и профиля роли)."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def is_field_taken(
        self, column: InstrumentedAttribute[str | None], value: str, role: UserRole
    ) -> bool:
        "Признак: соответствует ли сущность условию."
        result = await self.db.execute(
            select(Account.id).where(column == value, Account.role == ModelUserRole(role.value))
        )
        return result.first() is not None

    async def find_users_by_email(self, email: str, role: UserRole | None = None) -> list[Account]:
        "Ищет сущность по заданным параметрам."
        query = select(Account).where(Account.email == email)
        if role is not None:
            query = query.where(Account.role == ModelUserRole(role.value))
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def delete_unverified(self, email: str, role: UserRole) -> None:
        "Удаляет брошенную регистрацию: юзер с этим email+ролью, не подтвердивший почту."
        await self.db.execute(
            delete(Account).where(
                Account.email == email,
                Account.role == ModelUserRole(role.value),
                Account.email_verified.is_(False),
            )
        )
        await self.db.flush()

    async def add(self, entity: Base) -> None:
        "Добавляет сущность (аккаунт или профиль роли) в сессию и делает flush."
        self.db.add(entity)
        await self.db.flush()
