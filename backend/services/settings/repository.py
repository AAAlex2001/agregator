"Repository: доступ к БД для settings."
from datetime import UTC, datetime

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import InstrumentedAttribute

from models.account import Account
from models.email_change import EmailChangeRequest


class SettingsRepository:
    "Все обращения к БД для раздела настроек профиля."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_user_by_id(self, user_id: int) -> Account | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(select(Account).where(Account.id == user_id))
        ).scalars().first()

    async def field_taken_in_same_role(
        self, column: InstrumentedAttribute[str | None], value: str, user_id: int
    ) -> bool:
        "Публичный метод сервисного слоя."
        own_role = select(Account.role).where(Account.id == user_id).scalar_subquery()
        result = await self.db.execute(
            select(Account.id).where(column == value, Account.id != user_id, Account.role == own_role)
        )
        return result.first() is not None

    async def find_email_change(self, user_id: int) -> EmailChangeRequest | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(
                select(EmailChangeRequest).where(EmailChangeRequest.user_id == user_id)
            )
        ).scalars().first()

    async def delete_email_changes(self, user_id: int) -> None:
        "Удаляет сущность."
        await self.db.execute(
            delete(EmailChangeRequest).where(EmailChangeRequest.user_id == user_id)
        )

    async def add_email_change(self, request: EmailChangeRequest) -> None:
        "Добавляет связанные данные."
        self.db.add(request)
        await self.db.flush()

    async def flush(self) -> None:
        "Сбрасывает накопленные изменения в БД."
        await self.db.flush()

    @staticmethod
    def now() -> datetime:
        "Публичный метод сервисного слоя."
        return datetime.now(UTC)
