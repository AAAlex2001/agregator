from sqlalchemy import false, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.contact_deal import ContactAccessDeal
from models.user import User, UserRole


class ExpertContactRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_experts(
        self,
        actor_id: int | None,
        search: str | None,
        limit: int,
        offset: int,
    ) -> tuple[list[tuple[User, ContactAccessDeal | None]], int]:
        conditions = [User.role == UserRole.EXPERT, User.is_active.is_(True)]
        if search and search.strip():
            term = f"%{search.strip()}%"
            conditions.append(
                or_(
                    User.first_name.ilike(term),
                    User.last_name.ilike(term),
                    User.location_city.ilike(term),
                )
            )

        total = int(
            (await self.db.execute(select(func.count(User.id)).where(*conditions))).scalar_one()
        )
        deal_join = (
            (ContactAccessDeal.seller_id == User.id)
            & (ContactAccessDeal.buyer_id == actor_id)
            & (ContactAccessDeal.buyer_deleted_at.is_(None))
            if actor_id is not None
            else false()
        )
        query = (
            select(User, ContactAccessDeal)
            .outerjoin(ContactAccessDeal, deal_join)
            .where(*conditions)
            .order_by(
                User.contact_sales_enabled.desc(),
                User.rating.desc().nullslast(),
                User.id.desc(),
            )
            .limit(limit)
            .offset(offset)
        )
        rows = (await self.db.execute(query)).all()
        return [(row[0], row[1]) for row in rows], total

    async def get_active_expert(
        self,
        user_id: int,
        for_update: bool = False,
    ) -> User | None:
        query = select(User).where(
            User.id == user_id,
            User.role == UserRole.EXPERT,
            User.is_active.is_(True),
        )
        if for_update:
            query = query.with_for_update()
        return (await self.db.execute(query)).scalars().first()

    async def flush(self) -> None:
        await self.db.flush()
