from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.account import Account
from models.chat import Chat
from models.labor import LaborListing, LaborListingKind


class LaborRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_user(
        self,
        user_id: int,
        for_update: bool = False,
    ) -> Account | None:
        query = select(Account).where(Account.id == user_id)
        if for_update:
            query = query.with_for_update()
        return (await self.db.execute(query)).scalars().first()

    async def get_public(self, public_id: str) -> LaborListing | None:
        query = (
            select(LaborListing)
            .options(selectinload(LaborListing.owner))
            .where(
                LaborListing.public_id == public_id,
                LaborListing.is_active.is_(True),
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_for_actor(
        self,
        kind: LaborListingKind,
        actor_id: int,
        mine: bool,
    ) -> list[LaborListing]:
        load_options = [selectinload(LaborListing.owner)]
        if mine:
            load_options.extend(
                [
                    selectinload(LaborListing.chats).selectinload(Chat.customer),
                    selectinload(LaborListing.chats).selectinload(Chat.expert),
                ]
            )
        query = (
            select(LaborListing)
            .options(*load_options)
            .where(
                LaborListing.kind == kind,
                LaborListing.is_active.is_(True),
            )
        )
        if mine:
            query = query.where(LaborListing.owner_id == actor_id)
        else:
            query = query.where(LaborListing.owner_id != actor_id)
        query = query.order_by(LaborListing.created_at.desc())
        return list((await self.db.execute(query)).scalars().all())

    async def find_by_request(
        self,
        owner_id: int,
        client_request_id: UUID,
    ) -> LaborListing | None:
        query = (
            select(LaborListing)
            .options(selectinload(LaborListing.owner))
            .where(
                LaborListing.owner_id == owner_id,
                LaborListing.client_request_id == client_request_id,
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def get_by_id(
        self,
        listing_id: int,
        active_only: bool = False,
        for_update: bool = False,
    ) -> LaborListing | None:
        query = (
            select(LaborListing)
            .options(selectinload(LaborListing.owner))
            .where(LaborListing.id == listing_id)
        )
        if active_only:
            query = query.where(LaborListing.is_active.is_(True))
        if for_update:
            query = query.with_for_update(of=LaborListing)
        return (await self.db.execute(query)).scalars().first()

    async def find_chat(
        self,
        listing_id: int,
        customer_id: int,
        expert_id: int,
    ) -> Chat | None:
        query = select(Chat).where(
            Chat.labor_listing_id == listing_id,
            Chat.customer_id == customer_id,
            Chat.expert_id == expert_id,
        )
        return (await self.db.execute(query)).scalars().first()

    async def add(self, entity: LaborListing | Chat) -> None:
        self.db.add(entity)

    async def flush(self) -> None:
        await self.db.flush()
