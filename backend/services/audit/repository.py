"""Repository: доступ к БД для аудита СУПБ."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.account import Account
from models.audit import CustomerAuditProfile, ExpertAuditProfile, LicenseHolderAuditProfile


class AuditRepository:
    """Все обращения к БД для анкет аудита СУПБ."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_account(self, account_id: int) -> Account | None:
        """Ищет аккаунт вместе с профилями ролей."""
        query = select(Account).where(Account.id == account_id)
        return (await self.db.execute(query)).scalars().first()

    async def add(
        self, profile: CustomerAuditProfile | ExpertAuditProfile | LicenseHolderAuditProfile
    ) -> None:
        """Добавляет анкету в сессию."""
        self.db.add(profile)
        await self.db.flush()
