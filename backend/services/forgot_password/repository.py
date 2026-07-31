"Repository: доступ к БД для forgot_password."
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.account import Account


class ForgotPasswordRepository:
    "Все обращения к БД для сценария «забыли пароль»."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_user_by_email(self, email: str) -> Account | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(select(Account).where(Account.email == email))
        ).scalars().first()

    async def find_user_by_phone(self, phone: str) -> Account | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(select(Account).where(Account.phone == phone))
        ).scalars().first()

    async def list_users_by_email(self, email: str) -> list[Account]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        result = await self.db.execute(select(Account).where(Account.email == email))
        return list(result.scalars().all())

    async def list_users_by_phone(self, phone: str) -> list[Account]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        result = await self.db.execute(select(Account).where(Account.phone == phone))
        return list(result.scalars().all())
