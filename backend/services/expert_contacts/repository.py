from sqlalchemy import false, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.account import Account, UserRole
from models.contact_deal import ContactAccessDeal
from models.expert import Expert


class ExpertContactRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_experts(
        self,
        actor_id: int | None,
        search: str | None,
        limit: int,
        offset: int,
    ) -> tuple[list[tuple[Account, ContactAccessDeal | None]], int]:
        conditions = [Account.role == UserRole.EXPERT, Account.is_active.is_(True)]
        if search and search.strip():
            term = f"%{search.strip()}%"
            conditions.append(
                or_(
                    Account.first_name.ilike(term),
                    Account.last_name.ilike(term),
                    Expert.location_city.ilike(term),
                )
            )

        total = int(
            (
                await self.db.execute(
                    select(func.count(Account.id))
                    .join(Expert, Expert.account_id == Account.id)
                    .where(*conditions)
                )
            ).scalar_one()
        )
        deal_join = (
            (ContactAccessDeal.seller_id == Account.id)
            & (ContactAccessDeal.buyer_id == actor_id)
            & (ContactAccessDeal.buyer_deleted_at.is_(None))
            if actor_id is not None
            else false()
        )
        query = (
            select(Account, ContactAccessDeal)
            .join(Expert, Expert.account_id == Account.id)
            .outerjoin(ContactAccessDeal, deal_join)
            .where(*conditions)
            .order_by(
                Expert.contact_sales_enabled.desc(),
                Expert.rating.desc().nullslast(),
                Account.id.desc(),
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
    ) -> Account | None:
        query = select(Account).where(
            Account.id == user_id,
            Account.role == UserRole.EXPERT,
            Account.is_active.is_(True),
        )
        if for_update:
            query = query.with_for_update()
        return (await self.db.execute(query)).scalars().first()

    async def flush(self) -> None:
        await self.db.flush()
