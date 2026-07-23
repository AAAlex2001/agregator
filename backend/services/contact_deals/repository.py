from datetime import datetime

from sqlalchemy import and_, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.contact_deal import (
    ContactAccessDeal,
    ContactDealSignature,
    ContactDealStatus,
    ContactPaymentReceipt,
    ContactReceiptStatus,
)
from models.review import Review
from models.user import User, UserRole


class ContactDealRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(
        self,
        deal_id: int,
        for_update: bool = False,
    ) -> ContactAccessDeal | None:
        query = (
            select(ContactAccessDeal)
            .options(
                selectinload(ContactAccessDeal.seller),
                selectinload(ContactAccessDeal.buyer),
                selectinload(ContactAccessDeal.signatures),
                selectinload(ContactAccessDeal.receipts),
                selectinload(ContactAccessDeal.reviews),
            )
            .where(ContactAccessDeal.id == deal_id)
        )
        if for_update:
            query = query.execution_options(populate_existing=True).with_for_update(
                of=ContactAccessDeal
            )
        return (await self.db.execute(query)).scalars().first()

    async def get_by_public_id(self, public_id: str) -> ContactAccessDeal | None:
        query = (
            select(ContactAccessDeal)
            .options(
                selectinload(ContactAccessDeal.seller),
                selectinload(ContactAccessDeal.buyer),
                selectinload(ContactAccessDeal.signatures),
                selectinload(ContactAccessDeal.receipts),
                selectinload(ContactAccessDeal.reviews),
            )
            .where(ContactAccessDeal.public_id == public_id)
        )
        return (await self.db.execute(query)).scalars().first()

    async def get_user(self, user_id: int, for_update: bool = False) -> User | None:
        query = select(User).where(User.id == user_id, User.is_active.is_(True))
        if for_update:
            query = query.with_for_update()
        return (await self.db.execute(query)).scalars().first()

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

    async def find_for_seller_and_buyer(
        self,
        seller_id: int,
        buyer_id: int,
        for_update: bool = False,
    ) -> ContactAccessDeal | None:
        query = select(ContactAccessDeal.id).where(
            ContactAccessDeal.seller_id == seller_id,
            ContactAccessDeal.buyer_id == buyer_id,
        )
        if for_update:
            query = query.with_for_update()
        deal_id = (await self.db.execute(query)).scalar_one_or_none()
        return (
            await self.get(deal_id, for_update=for_update)
            if deal_id is not None
            else None
        )

    async def list_for_user(self, user_id: int) -> list[ContactAccessDeal]:
        query = (
            select(ContactAccessDeal)
            .options(
                selectinload(ContactAccessDeal.seller),
                selectinload(ContactAccessDeal.buyer),
            )
            .where(
                or_(
                    ContactAccessDeal.seller_id == user_id,
                    and_(
                        ContactAccessDeal.buyer_id == user_id,
                        ContactAccessDeal.buyer_deleted_at.is_(None),
                    ),
                )
            )
            .order_by(ContactAccessDeal.updated_at.desc(), ContactAccessDeal.id.desc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def list_admin(
        self, status_filter: ContactDealStatus | None = None
    ) -> list[tuple[ContactAccessDeal, int]]:
        receipt_count = func.count(ContactPaymentReceipt.id)
        query = (
            select(ContactAccessDeal, receipt_count)
            .outerjoin(ContactPaymentReceipt, ContactPaymentReceipt.deal_id == ContactAccessDeal.id)
            .options(
                selectinload(ContactAccessDeal.seller),
                selectinload(ContactAccessDeal.buyer),
            )
            .group_by(ContactAccessDeal.id)
            .order_by(ContactAccessDeal.updated_at.desc(), ContactAccessDeal.id.desc())
        )
        if status_filter is not None:
            query = query.where(ContactAccessDeal.status == status_filter)
        rows = (await self.db.execute(query)).all()
        return [(row[0], int(row[1])) for row in rows]

    async def add_deal(self, deal: ContactAccessDeal) -> None:
        self.db.add(deal)

    async def add_signature(self, signature: ContactDealSignature) -> None:
        self.db.add(signature)

    async def add_receipt(self, receipt: ContactPaymentReceipt) -> None:
        self.db.add(receipt)

    async def add_review(self, review: Review) -> None:
        self.db.add(review)

    async def find_review(
        self,
        deal_id: int,
        buyer_id: int,
    ) -> Review | None:
        query = select(Review).where(
            Review.contact_deal_id == deal_id,
            Review.customer_id == buyer_id,
        )
        return (await self.db.execute(query)).scalars().first()

    async def review_stats(self, expert_id: int) -> tuple[int, float | None]:
        count, average = (
            await self.db.execute(
                select(func.count(Review.id), func.avg(Review.rating)).where(
                    Review.expert_id == expert_id
                )
            )
        ).one()
        return int(count or 0), float(average) if average is not None else None

    async def supersede_pending_receipts(self, deal_id: int, reviewed_at: datetime) -> None:
        await self.db.execute(
            update(ContactPaymentReceipt)
            .where(
                ContactPaymentReceipt.deal_id == deal_id,
                ContactPaymentReceipt.status == ContactReceiptStatus.PENDING,
            )
            .values(status=ContactReceiptStatus.SUPERSEDED, reviewed_at=reviewed_at)
        )

    async def flush(self) -> None:
        await self.db.flush()
