"Repository: доступ к БД для chats."
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import and_, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.account import Account
from models.chat import Chat, ChatMessage
from models.contact_deal import ContactAccessDeal
from models.labor import LaborListing
from models.order import Order
from models.response import OrderResponse
from models.session import Session


class ChatRepository:
    "Все обращения к БД по чатам и сообщениям."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_user(self, user_id: int) -> Account | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(select(Account).where(Account.id == user_id))
        ).scalars().first()

    async def find_order(
        self,
        order_id: int,
        for_update: bool = False,
    ) -> Order | None:
        "Ищет сущность по заданным параметрам."
        query = (
            select(Order)
            .options(selectinload(Order.customer), selectinload(Order.assigned_expert))
            .where(Order.id == order_id)
        )
        if for_update:
            query = query.with_for_update(of=Order)
        return (await self.db.execute(query)).scalars().first()

    async def find_contact_deal(
        self,
        deal_id: int,
        for_update: bool = False,
    ) -> ContactAccessDeal | None:
        query = select(ContactAccessDeal).where(ContactAccessDeal.id == deal_id)
        if for_update:
            query = query.with_for_update()
        return (await self.db.execute(query)).scalars().first()

    async def find_contact_deal_chat(self, deal_id: int) -> Chat | None:
        query = select(Chat).where(Chat.contact_deal_id == deal_id)
        return (await self.db.execute(query)).scalars().first()

    async def find_chat_by_uuid_for_actor(
        self, chat_uuid: UUID, actor_id: int
    ) -> Chat | None:
        "Ищет сущность по заданным параметрам."
        query = (
            select(Chat)
            .options(
                selectinload(Chat.order),
                selectinload(Chat.labor_listing),
                selectinload(Chat.contact_deal),
                selectinload(Chat.customer),
                selectinload(Chat.expert),
            )
            .where(
                Chat.uuid == chat_uuid,
                or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id),
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_chat_by_id_for_actor(
        self, chat_id: int, actor_id: int
    ) -> Chat | None:
        "Ищет сущность по заданным параметрам."
        query = (
            select(Chat)
            .options(
                selectinload(Chat.order),
                selectinload(Chat.labor_listing),
                selectinload(Chat.contact_deal),
                selectinload(Chat.customer),
                selectinload(Chat.expert),
            )
            .where(
                Chat.id == chat_id,
                or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id),
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_latest_chat_for_customer(
        self, order_id: int, customer_id: int
    ) -> Chat | None:
        "Ищет сущность по заданным параметрам."
        query = (
            select(Chat)
            .where(Chat.order_id == order_id, Chat.customer_id == customer_id)
            .order_by(Chat.updated_at.desc(), Chat.id.desc())
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_latest_chat_for_expert(
        self, order_id: int, expert_id: int
    ) -> Chat | None:
        "Ищет сущность по заданным параметрам."
        query = (
            select(Chat)
            .where(Chat.order_id == order_id, Chat.expert_id == expert_id)
            .order_by(Chat.updated_at.desc(), Chat.id.desc())
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_pair_chat(
        self, order_id: int, customer_id: int, expert_id: int
    ) -> Chat | None:
        "Ищет сущность по заданным параметрам."
        query = select(Chat).where(
            Chat.order_id == order_id,
            Chat.customer_id == customer_id,
            Chat.expert_id == expert_id,
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_actor_chats(self, actor_id: int) -> list[Chat]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = (
            select(Chat)
            .options(
                selectinload(Chat.order),
                selectinload(Chat.labor_listing),
                selectinload(Chat.contact_deal),
                selectinload(Chat.customer),
                selectinload(Chat.expert),
            )
            .where(or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id))
            .order_by(Chat.updated_at.desc(), Chat.id.desc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def last_messages_for(self, chat_ids: list[int]) -> dict[int, ChatMessage]:
        "Публичный метод сервисного слоя."
        if not chat_ids:
            return {}
        sub = (
            select(ChatMessage.chat_id, func.max(ChatMessage.id).label("max_id"))
            .where(ChatMessage.chat_id.in_(chat_ids))
            .group_by(ChatMessage.chat_id)
            .subquery()
        )
        query = select(ChatMessage).join(
            sub,
            and_(ChatMessage.chat_id == sub.c.chat_id, ChatMessage.id == sub.c.max_id),
        )
        rows = (await self.db.execute(query)).scalars().all()
        return {message.chat_id: message for message in rows}

    async def unread_counts_for(
        self, chat_ids: list[int], actor_id: int
    ) -> dict[int, int]:
        "Публичный метод сервисного слоя."
        if not chat_ids:
            return {}
        query = (
            select(ChatMessage.chat_id, func.count().label("cnt"))
            .where(
                ChatMessage.chat_id.in_(chat_ids),
                ChatMessage.sender_id != actor_id,
                ChatMessage.is_read.is_(False),
            )
            .group_by(ChatMessage.chat_id)
        )
        rows = (await self.db.execute(query)).all()
        return {row.chat_id: row.cnt for row in rows}

    async def unread_labor_response_chat_ids(
        self,
        chat_ids: list[int],
        actor_id: int,
    ) -> set[int]:
        if not chat_ids:
            return set()
        query = (
            select(Chat.id)
            .join(
                LaborListing,
                LaborListing.id == Chat.labor_listing_id,
            )
            .where(
                Chat.id.in_(chat_ids),
                LaborListing.owner_id == actor_id,
                Chat.labor_response_is_read.is_(False),
            )
        )
        return set((await self.db.execute(query)).scalars().all())

    async def chat_messages_tail(self, chat_id: int, limit: int) -> list[ChatMessage]:
        "Публичный метод сервисного слоя."
        query = (
            select(ChatMessage)
            .where(ChatMessage.chat_id == chat_id)
            .order_by(ChatMessage.id.desc())
            .limit(limit)
        )
        rows = (await self.db.execute(query)).scalars().all()
        return list(reversed(rows))

    async def find_message_by_client_id(
        self,
        chat_id: int,
        sender_id: int,
        client_message_id: UUID,
    ) -> ChatMessage | None:
        query = select(ChatMessage).where(
            ChatMessage.chat_id == chat_id,
            ChatMessage.sender_id == sender_id,
            ChatMessage.client_message_id == client_message_id,
        )
        return (await self.db.execute(query)).scalars().first()

    async def lock_chat_for_message(
        self,
        chat_id: int,
        actor_id: int,
    ) -> Chat | None:
        context_query = select(
            Chat.order_id,
            Chat.labor_listing_id,
            Chat.contact_deal_id,
        ).where(
            Chat.id == chat_id,
            or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id),
        )
        context = (await self.db.execute(context_query)).first()
        if context is None:
            return None

        order_id, labor_listing_id, contact_deal_id = context
        if order_id is not None:
            await self.db.execute(
                select(Order).where(Order.id == order_id).with_for_update()
            )
        elif labor_listing_id is not None:
            await self.db.execute(
                select(LaborListing)
                .where(LaborListing.id == labor_listing_id)
                .with_for_update()
            )
        elif contact_deal_id is not None:
            await self.db.execute(
                select(ContactAccessDeal)
                .where(ContactAccessDeal.id == contact_deal_id)
                .with_for_update()
            )

        query = (
            select(Chat)
            .options(
                selectinload(Chat.order),
                selectinload(Chat.labor_listing),
                selectinload(Chat.contact_deal),
                selectinload(Chat.customer),
                selectinload(Chat.expert),
            )
            .where(
                Chat.id == chat_id,
                or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id),
            )
            .execution_options(populate_existing=True)
            .with_for_update(of=Chat)
        )
        return (await self.db.execute(query)).scalars().first()

    async def response_status_for(self, order_id: int | None, expert_id: int) -> str | None:
        "Публичный метод сервисного слоя."
        if order_id is None:
            return None
        query = select(OrderResponse.status).where(
            OrderResponse.order_id == order_id,
            OrderResponse.expert_id == expert_id,
        )
        value = (await self.db.execute(query)).scalar_one_or_none()
        return value.value if value is not None else None

    async def unread_message_ids(self, chat_id: int, reader_id: int) -> list[int]:
        "Публичный метод сервисного слоя."
        query = select(ChatMessage.id).where(
            ChatMessage.chat_id == chat_id,
            ChatMessage.sender_id != reader_id,
            ChatMessage.is_read.is_(False),
        )
        return list((await self.db.execute(query)).scalars().all())

    async def mark_as_read(self, message_ids: list[int]) -> None:
        "Отмечает сущность соответствующим состоянием."
        if not message_ids:
            return
        await self.db.execute(
            update(ChatMessage)
            .where(ChatMessage.id.in_(message_ids))
            .values(is_read=True)
        )
        await self.db.flush()

    async def mark_labor_response_as_read(
        self,
        chat_id: int,
        reader_id: int,
    ) -> None:
        owner_listing_ids = select(LaborListing.id).where(
            LaborListing.owner_id == reader_id
        )
        await self.db.execute(
            update(Chat)
            .where(
                Chat.id == chat_id,
                Chat.labor_listing_id.in_(owner_listing_ids),
                Chat.labor_response_is_read.is_(False),
            )
            .values(labor_response_is_read=True)
        )
        await self.db.flush()

    async def touch_chat(self, chat_id: int) -> None:
        "Обновляет служебные поля сущности."
        await self.db.execute(
            update(Chat).where(Chat.id == chat_id).values(updated_at=datetime.now(UTC))
        )

    async def find_active_session(self, session_id: str) -> Session | None:
        "Возвращает сессию, если она существует и не истекла."
        session = (
            await self.db.execute(
                select(Session).where(Session.session_id == session_id)
            )
        ).scalars().first()
        if session is None:
            return None
        now = datetime.now(UTC)
        if now > session.max_expires_at or now > session.expires_at:
            return None
        return session

    async def block_chat(self, chat_id: int) -> None:
        "Блокирует сущность."
        await self.db.execute(
            update(Chat)
            .where(Chat.id == chat_id)
            .values(is_blocked=True)
        )
        await self.db.flush()

    async def unblock_chat(self, chat_id: int) -> None:
        "Разблокирует сущность."
        await self.db.execute(
            update(Chat)
            .where(Chat.id == chat_id)
            .values(is_blocked=False)
        )
        await self.db.flush()

    async def add(self, entity: Chat | ChatMessage) -> None:
        "Добавляет сущность в сессию."
        self.db.add(entity)

    async def flush(self) -> None:
        "Сбрасывает накопленные изменения в БД."
        await self.db.flush()
