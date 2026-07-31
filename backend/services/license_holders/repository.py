"Repository: доступ к БД для license_holders."
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.account import Account, UserRole
from models.license_holder import LicenseHolder


class LicenseHoldersRepository:
    "Все обращения к БД по сущности «держатель лицензии». Никакой бизнес-логики."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_active(
        self, skip: int, limit: int
    ) -> tuple[list[tuple[Account, LicenseHolder]], int]:
        "Постраничный список пар аккаунт + профиль активных лицензиатов плюс общее их количество."
        base_filter = (Account.role == UserRole.LICENSE_HOLDER) & (Account.is_active.is_(True))

        total = (
            await self.db.execute(
                select(func.count(Account.id))
                .join(LicenseHolder, LicenseHolder.account_id == Account.id)
                .where(base_filter)
            )
        ).scalar_one()

        rows = (
            await self.db.execute(
                select(Account, LicenseHolder)
                .join(LicenseHolder, LicenseHolder.account_id == Account.id)
                .where(base_filter)
                .order_by(Account.created_at.desc())
                .offset(skip)
                .limit(limit)
            )
        ).all()
        return [(account, profile) for account, profile in rows], int(total)
