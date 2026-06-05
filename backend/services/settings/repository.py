from datetime import UTC, datetime

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.email_change import EmailChangeRequest
from models.user import User


class SettingsRepository:
    "Все обращения к БД для раздела настроек профиля."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_user_by_id(self, user_id: int) -> User | None:
        return (
            await self.db.execute(select(User).where(User.id == user_id))
        ).scalars().first()

    async def field_taken_in_same_role(self, column, value, user_id: int) -> bool:
        own_role = select(User.role).where(User.id == user_id).scalar_subquery()
        result = await self.db.execute(
            select(User.id).where(column == value, User.id != user_id, User.role == own_role)
        )
        return result.first() is not None

    async def find_email_change(self, user_id: int) -> EmailChangeRequest | None:
        return (
            await self.db.execute(
                select(EmailChangeRequest).where(EmailChangeRequest.user_id == user_id)
            )
        ).scalars().first()

    async def delete_email_changes(self, user_id: int) -> None:
        await self.db.execute(
            delete(EmailChangeRequest).where(EmailChangeRequest.user_id == user_id)
        )

    async def add_email_change(self, request: EmailChangeRequest) -> None:
        self.db.add(request)
        await self.db.flush()

    async def flush(self) -> None:
        await self.db.flush()

    @staticmethod
    def now() -> datetime:
        return datetime.now(UTC)
