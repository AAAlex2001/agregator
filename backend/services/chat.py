from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import and_, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.chat import Chat, ChatMessage
from models.order import Order
from models.user import User, UserRole
from schemas.chat import ChatBadgeResponse, ChatDetailResponse, ChatListItemResponse, ChatMessageResponse


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user(self, user_id: int) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Пользователь неактивен")
        return user

    async def get_chat_by_uuid(self, chat_uuid: str, actor_id: int) -> Chat:
        try:
            parsed_uuid = UUID(chat_uuid)
        except (ValueError, TypeError):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден")

        result = await self.db.execute(
            select(Chat)
            .options(
                selectinload(Chat.order),
                selectinload(Chat.customer),
                selectinload(Chat.expert),
            )
            .where(
                Chat.uuid == parsed_uuid,
                or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id),
            )
        )
        chat = result.scalars().first()
        if not chat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден")
        return chat

    async def open_chat(self, actor_id: int, order_id: int) -> Chat:
        actor = await self.get_user(actor_id)
        order_result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.customer), selectinload(Order.assigned_expert))
            .where(Order.id == order_id)
        )
        order = order_result.scalars().first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

        if actor.role == UserRole.CUSTOMER:
            existing_chat_result = await self.db.execute(
                select(Chat)
                .where(
                    Chat.order_id == order.id,
                    Chat.customer_id == actor.id,
                )
                .order_by(Chat.updated_at.desc(), Chat.id.desc())
            )
        else:
            existing_chat_result = await self.db.execute(
                select(Chat)
                .where(
                    Chat.order_id == order.id,
                    Chat.expert_id == actor.id,
                )
                .order_by(Chat.updated_at.desc(), Chat.id.desc())
            )

        existing_chat = existing_chat_result.scalars().first()
        if existing_chat:
            return existing_chat

        if order.assigned_expert_id is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Чат можно открыть после назначения эксперта",
            )

        if actor.id not in {order.customer_id, order.assigned_expert_id}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нет доступа к чату этого заказа",
            )

        chat_result = await self.db.execute(
            select(Chat).where(
                Chat.order_id == order.id,
                Chat.customer_id == order.customer_id,
                Chat.expert_id == order.assigned_expert_id,
            )
        )
        chat = chat_result.scalars().first()

        if chat:
            return chat

        chat = Chat(
            order_id=order.id,
            customer_id=order.customer_id,
            expert_id=order.assigned_expert_id,
        )
        self.db.add(chat)
        await self.db.commit()
        await self.db.refresh(chat)
        return chat

    def resolve_counterpart(self, actor_id: int, actor_role: UserRole, chat: Chat) -> tuple[int, str, str | None]:
        if actor_role == UserRole.CUSTOMER:
            expert = chat.expert
            if expert is None:
                return chat.expert_id, f"Эксперт #{chat.expert_id}", None
            full_name = " ".join(part for part in [expert.first_name, expert.last_name] if part).strip()
            return expert.id, full_name or f"Эксперт #{expert.id}", None

        customer = chat.customer
        if customer is None:
            return chat.customer_id, f"Заказчик #{chat.customer_id}", None

        company_name = chat.order.company if chat.order and chat.order.company else ""
        full_name = " ".join(part for part in [customer.first_name, customer.last_name] if part).strip()
        display_name = company_name or full_name or f"Заказчик #{customer.id}"
        return customer.id, display_name, None

    @staticmethod
    def format_sum(amount_kopecks: int) -> str:
        roubles = amount_kopecks // 100
        formatted = f"{roubles:,}".replace(",", " ")
        if amount_kopecks % 100:
            return f"{formatted},{amount_kopecks % 100:02d} ₽"
        return f"{formatted} ₽"

    async def list_chats(self, actor_id: int) -> list[ChatListItemResponse]:
        actor = await self.get_user(actor_id)
        chats_result = await self.db.execute(
            select(Chat)
            .options(
                selectinload(Chat.order),
                selectinload(Chat.customer),
                selectinload(Chat.expert),
            )
            .where(or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id))
            .order_by(Chat.updated_at.desc(), Chat.id.desc())
        )
        chats = chats_result.scalars().all()
        chat_ids = [chat.id for chat in chats]

        if not chat_ids:
            return []

        sub = (
            select(ChatMessage.chat_id, func.max(ChatMessage.id).label("max_id"))
            .where(ChatMessage.chat_id.in_(chat_ids))
            .group_by(ChatMessage.chat_id)
            .subquery()
        )
        rows = await self.db.execute(
            select(ChatMessage).join(
                sub, and_(ChatMessage.chat_id == sub.c.chat_id, ChatMessage.id == sub.c.max_id),
            )
        )
        last_messages: dict[int, ChatMessage] = {m.chat_id: m for m in rows.scalars().all()}

        unread_rows = await self.db.execute(
            select(ChatMessage.chat_id, func.count().label("cnt"))
            .where(
                ChatMessage.chat_id.in_(chat_ids),
                ChatMessage.sender_id != actor_id,
                ChatMessage.is_read == False,  # noqa: E712
            )
            .group_by(ChatMessage.chat_id)
        )
        unread_counts: dict[int, int] = {row.chat_id: row.cnt for row in unread_rows}

        items: list[ChatListItemResponse] = []
        for chat in chats:
            counterpart_id, counterpart_name, counterpart_avatar_url = self.resolve_counterpart(actor_id, actor.role, chat)
            last_message = last_messages.get(chat.id)
            items.append(
                ChatListItemResponse(
                    id=chat.id,
                    uuid=str(chat.uuid),
                    order_id=chat.order_id,
                    counterpart_id=counterpart_id,
                    counterpart_name=counterpart_name,
                    counterpart_avatar_url=counterpart_avatar_url,
                    last_message_text=last_message.text if last_message else "",
                    last_message_sender_id=last_message.sender_id if last_message else None,
                    last_message_at=last_message.created_at if last_message else None,
                    unread_count=unread_counts.get(chat.id, 0),
                    updated_at=chat.updated_at,
                )
            )
        return items

    async def get_chat_for_actor(self, chat_id: int, actor_id: int) -> Chat:
        result = await self.db.execute(
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
        chat = result.scalars().first()
        if not chat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден")
        return chat

    async def get_chat_detail(self, chat_id: int, actor_id: int, limit: int = 200) -> ChatDetailResponse:
        chat_row = await self.db.execute(
            select(Chat, User)
            .join(User, User.id == actor_id)
            .options(
                selectinload(Chat.order),
                selectinload(Chat.customer),
                selectinload(Chat.expert),
            )
            .where(
                Chat.id == chat_id,
                or_(Chat.customer_id == actor_id, Chat.expert_id == actor_id),
                User.is_active == True,  # noqa: E712
            )
        )
        row = chat_row.first()
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден")
        chat, actor = row

        message_rows = await self.db.execute(
            select(ChatMessage)
            .where(ChatMessage.chat_id == chat_id)
            .order_by(ChatMessage.id.desc())
            .limit(limit)
        )
        messages = list(reversed(message_rows.scalars().all()))

        counterpart_id, counterpart_name, counterpart_avatar_url = self.resolve_counterpart(actor_id, actor.role, chat)

        return ChatDetailResponse(
            id=chat.id,
            uuid=str(chat.uuid),
            order_id=chat.order_id,
            customer_id=chat.customer_id,
            expert_id=chat.expert_id,
            order_title=chat.order.title if chat.order else "",
            order_company=chat.order.company if chat.order else "",
            order_date=chat.order.deadline.strftime("%d.%m.%Y") if chat.order else "",
            order_sum=self.format_sum(chat.order.sum_amount) if chat.order else "",
            order_badges=[
                ChatBadgeResponse(text=badge.text, variant=badge.variant.value)
                for badge in (chat.order.badges if chat.order else [])
            ],
            counterpart_id=counterpart_id,
            counterpart_name=counterpart_name,
            counterpart_avatar_url=counterpart_avatar_url,
            messages=[
                ChatMessageResponse(
                    id=message.id,
                    chat_id=message.chat_id,
                    sender_id=message.sender_id,
                    sender_role=(
                        UserRole.CUSTOMER.value
                        if message.sender_id == chat.customer_id
                        else UserRole.EXPERT.value
                    ),
                    text=message.text,
                    is_read=message.is_read,
                    created_at=message.created_at,
                )
                for message in messages
            ],
        )

    async def send_message(self, chat_id: int, sender_id: int, text: str) -> ChatMessageResponse:
        normalized_text = text.strip()
        if not normalized_text:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пустое сообщение отправить нельзя")

        chat_row = await self.db.execute(
            select(Chat.id, Chat.customer_id)
            .where(
                Chat.id == chat_id,
                or_(Chat.customer_id == sender_id, Chat.expert_id == sender_id),
            )
        )
        chat_data = chat_row.first()
        if not chat_data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Чат не найден")

        message = ChatMessage(
            chat_id=chat_id,
            sender_id=sender_id,
            text=normalized_text,
        )
        self.db.add(message)
        await self.db.flush()

        await self.db.execute(
            update(Chat)
            .where(Chat.id == chat_id)
            .values(updated_at=datetime.now(timezone.utc))
        )

        await self.db.commit()

        sender_role = UserRole.CUSTOMER.value if sender_id == chat_data.customer_id else UserRole.EXPERT.value
        return ChatMessageResponse(
            id=message.id,
            chat_id=message.chat_id,
            sender_id=message.sender_id,
            sender_role=sender_role,
            text=message.text,
            is_read=False,
            created_at=message.created_at,
        )

    async def mark_messages_read(self, chat_id: int, reader_id: int) -> list[int]:
        """Mark unread messages from counterpart as read. Returns marked IDs."""
        result = await self.db.execute(
            select(ChatMessage.id)
            .where(
                ChatMessage.chat_id == chat_id,
                ChatMessage.sender_id != reader_id,
                ChatMessage.is_read == False,  # noqa: E712
            )
        )
        ids = list(result.scalars().all())
        if ids:
            await self.db.execute(
                update(ChatMessage)
                .where(ChatMessage.id.in_(ids))
                .values(is_read=True)
            )
            await self.db.commit()
        return ids
