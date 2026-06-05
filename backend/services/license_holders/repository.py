"Repository: доступ к БД для license_holders."
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User, UserRole


class LicenseHoldersRepository:
    "Все обращения к БД по сущности «держатель лицензии». Никакой бизнес-логики."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_active(self, skip: int, limit: int) -> tuple[list[User], int]:
        "Постраничный список активных лицензиатов плюс общее их количество."
        base_filter = (User.role == UserRole.LICENSE_HOLDER) & (User.is_active.is_(True))

        total = (
            await self.db.execute(select(func.count(User.id)).where(base_filter))
        ).scalar_one()

        rows = (
            await self.db.execute(
                select(User)
                .where(base_filter)
                .order_by(User.created_at.desc())
                .offset(skip)
                .limit(limit)
            )
        ).scalars().all()
        return list(rows), int(total)
