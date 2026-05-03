from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import and_, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.chat import Chat, ChatMessage
from models.order import Order, OrderStatus
from models.response import OrderResponse
from models.user import User


class ChatRepository:
    "Все обращения к БД по чатам и сообщениям."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_user(self, user_id: int) -> User | None:
        return (
            await self.db.execute(select(User).where(User.id == user_id))
        ).scalars().first()

    async def find_order(self, order_id: int) -> Order | None:
        query = (
            select(Order)
            .options(selectinload(Order.customer), selectinload(Order.assigned_expert))
            .where(Order.id == order_id)
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_chat_by_uuid_for_actor(
        self, chat_uuid: UUID, actor_id: int
    ) -> Chat | None:
        query = (
            select(Chat)
            .options(
                selectinload(Chat.order),
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
        query = (
            select(Chat)
            .options(
                selectinload(Chat.order),
                selectinload(Chat.customer),
                selectinload(Chat.expert),
            )
            .where(
                Chat.id == chat_id,
                or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id),
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_chat_by_id_with_order(
        self, chat_id: int, actor_id: int
    ) -> Chat | None:
        query = (
            select(Chat)
            .options(selectinload(Chat.order))
            .where(
                Chat.id == chat_id,
                or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id),
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_latest_chat_for_customer(
        self, order_id: int, customer_id: int
    ) -> Chat | None:
        query = (
            select(Chat)
            .where(Chat.order_id == order_id, Chat.customer_id == customer_id)
            .order_by(Chat.updated_at.desc(), Chat.id.desc())
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_latest_chat_for_expert(
        self, order_id: int, expert_id: int
    ) -> Chat | None:
        query = (
            select(Chat)
            .where(Chat.order_id == order_id, Chat.expert_id == expert_id)
            .order_by(Chat.updated_at.desc(), Chat.id.desc())
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_pair_chat(
        self, order_id: int, customer_id: int, expert_id: int
    ) -> Chat | None:
        query = select(Chat).where(
            Chat.order_id == order_id,
            Chat.customer_id == customer_id,
            Chat.expert_id == expert_id,
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_actor_chats(self, actor_id: int) -> list[Chat]:
        query = (
            select(Chat)
            .options(
                selectinload(Chat.order),
                selectinload(Chat.customer),
                selectinload(Chat.expert),
            )
            .where(or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id))
            .order_by(Chat.updated_at.desc(), Chat.id.desc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def last_messages_for(self, chat_ids: list[int]) -> dict[int, ChatMessage]:
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
        if not chat_ids:
            return {}
        query = (
            select(ChatMessage.chat_id, func.count().label("cnt"))
            .where(
                ChatMessage.chat_id.in_(chat_ids),
                ChatMessage.sender_id != actor_id,
                ChatMessage.is_read == False,
            )
            .group_by(ChatMessage.chat_id)
        )
        rows = (await self.db.execute(query)).all()
        return {row.chat_id: row.cnt for row in rows}

    async def chat_messages_tail(self, chat_id: int, limit: int) -> list[ChatMessage]:
        query = (
            select(ChatMessage)
            .where(ChatMessage.chat_id == chat_id)
            .order_by(ChatMessage.id.desc())
            .limit(limit)
        )
        rows = (await self.db.execute(query)).scalars().all()
        return list(reversed(rows))

    async def response_status_for(self, order_id: int, expert_id: int) -> str | None:
        query = select(OrderResponse.status).where(
            OrderResponse.order_id == order_id,
            OrderResponse.expert_id == expert_id,
        )
        value = (await self.db.execute(query)).scalar_one_or_none()
        return value.value if value is not None else None

    async def unread_message_ids(self, chat_id: int, reader_id: int) -> list[int]:
        query = select(ChatMessage.id).where(
            ChatMessage.chat_id == chat_id,
            ChatMessage.sender_id != reader_id,
            ChatMessage.is_read == False,
        )
        return list((await self.db.execute(query)).scalars().all())

    async def mark_as_read(self, message_ids: list[int]) -> None:
        if not message_ids:
            return
        await self.db.execute(
            update(ChatMessage)
            .where(ChatMessage.id.in_(message_ids))
            .values(is_read=True)
        )
        await self.db.flush()

    async def touch_chat(self, chat_id: int) -> None:
        await self.db.execute(
            update(Chat).where(Chat.id == chat_id).values(updated_at=datetime.now(timezone.utc))
        )

    async def is_chat_blocked(self, chat_id: int) -> bool:
        query = (
            select(Chat.is_blocked, Order.status)
            .select_from(Chat)
            .join(Order, Order.id == Chat.order_id)
            .where(Chat.id == chat_id)
        )
        row = (await self.db.execute(query)).first()
        if row is None:
            return False
        is_blocked, order_status = row
        return is_blocked or order_status == OrderStatus.ARCHIVED

    async def block_chat(self, chat_id: int) -> None:
        await self.db.execute(
            update(Chat)
            .where(Chat.id == chat_id)
            .values(is_blocked=True)
        )
        await self.db.flush()

    async def unblock_chat(self, chat_id: int) -> None:
        await self.db.execute(
            update(Chat)
            .where(Chat.id == chat_id)
            .values(is_blocked=False)
        )
        await self.db.flush()

    async def add(self, entity) -> None:
        self.db.add(entity)

    async def flush(self) -> None:
        await self.db.flush()
