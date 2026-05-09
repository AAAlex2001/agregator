from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User, UserRole


class LicenseHolderRepository:
    "Доступ к списку держателей лицензии — для EXPERT-каталога."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_active(self, skip: int, limit: int) -> tuple[list[User], int]:
        base_filter = (User.role == UserRole.LICENSE_HOLDER) & (User.is_active.is_(True))

        count_q = select(func.count(User.id)).where(base_filter)
        total = (await self.db.execute(count_q)).scalar_one()

        list_q = (
            select(User)
            .where(base_filter)
            .order_by(User.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        rows = (await self.db.execute(list_q)).scalars().all()
        return list(rows), total
