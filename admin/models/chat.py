import uuid as uuid_mod
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.order import Order
    from models.user import User


class Chat(Base):
    "Чат по заказу между заказчиком и исполнителем."
    __tablename__ = "chats"
    __table_args__ = (
        UniqueConstraint("order_id", "customer_id", "expert_id", name="uq_chats_order_customer_expert"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    uuid: Mapped[uuid_mod.UUID] = mapped_column(UUID(as_uuid=True), default=uuid_mod.uuid4, unique=True, nullable=False, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    expert_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    order: Mapped["Order"] = relationship(back_populates="chats")
    customer: Mapped["User"] = relationship(foreign_keys=[customer_id], back_populates="customer_chats")
    expert: Mapped["User"] = relationship(foreign_keys=[expert_id], back_populates="expert_chats")
    messages: Mapped[list["ChatMessage"]] = relationship(back_populates="chat", order_by="ChatMessage.created_at.asc()", passive_deletes=True)

    def __str__(self) -> str:
        return f"Чат #{self.id} (заказ #{self.order_id})"


class ChatMessage(Base):
    "Сообщение в чате по заказу."
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    text: Mapped[str] = mapped_column(String(5000), nullable=False)
    file_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    file_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    attachments: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list, server_default="[]")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    chat: Mapped["Chat"] = relationship(back_populates="messages")
    sender: Mapped["User"] = relationship(back_populates="chat_messages")

    def __str__(self) -> str:
        return f"{self.text[:50]}"


class ExpertRoomMessage(Base):
    "Сообщение в общей комнате исполнителей."
    __tablename__ = "expert_room_messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    text: Mapped[str] = mapped_column(String(2000), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False, index=True)

    sender: Mapped["User"] = relationship(lazy="joined")

    def __str__(self) -> str:
        return f"#{self.id}: {self.text[:50]}"


class ExpertRoomBan(Base):
    "Бан пользователя в комнате исполнителей."
    __tablename__ = "expert_room_bans"
    __table_args__ = (UniqueConstraint("user_id", name="uq_expert_room_bans_user"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    reason: Mapped[str] = mapped_column(String(500), nullable=False, default="", server_default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    user: Mapped["User"] = relationship(lazy="joined")

    def __str__(self) -> str:
        return f"Бан #{self.id} (user_id={self.user_id})"
