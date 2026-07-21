import uuid as uuid_mod
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any
from uuid import UUID as PyUUID

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.labor import LaborListing
    from models.order import Order
    from models.user import User


class Chat(Base):
    """Чат между заказчиком и экспертом по заказу."""
    __tablename__ = "chats"
    __table_args__ = (
        UniqueConstraint("order_id", "customer_id", "expert_id", name="uq_chats_order_customer_expert"),
        UniqueConstraint("labor_listing_id", "customer_id", "expert_id", name="uq_chats_labor_customer_expert"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    uuid: Mapped[PyUUID] = mapped_column(UUID(as_uuid=True), default=uuid_mod.uuid4, unique=True, nullable=False, index=True)
    order_id: Mapped[int | None] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=True, index=True)
    labor_listing_id: Mapped[int | None] = mapped_column(
        ForeignKey("labor_listings.id", ondelete="CASCADE"), nullable=True, index=True
    )
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    expert_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )
    is_blocked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false")

    order: Mapped["Order | None"] = relationship(back_populates="chats")
    labor_listing: Mapped["LaborListing | None"] = relationship(back_populates="chats")
    customer: Mapped["User"] = relationship(foreign_keys=[customer_id], back_populates="customer_chats")
    expert: Mapped["User"] = relationship(foreign_keys=[expert_id], back_populates="expert_chats")
    messages: Mapped[list["ChatMessage"]] = relationship(
        back_populates="chat",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="noload",
        order_by="ChatMessage.created_at.asc()",
    )


class ChatMessage(Base):
    """Сообщение в чате."""
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


class ExpertRoomMessage(Base):
    """Сообщение в общей комнате экспертов."""
    __tablename__ = "expert_room_messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    sender_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    text: Mapped[str] = mapped_column(String(2000), nullable=False, default="", server_default="")
    attachments: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list, server_default="[]")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
        index=True,
    )

    sender: Mapped["User"] = relationship()


class ExpertRoomBan(Base):
    """Бан пользователя в комнате экспертов."""
    __tablename__ = "expert_room_bans"
    __table_args__ = (UniqueConstraint("user_id", name="uq_expert_room_bans_user"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    reason: Mapped[str] = mapped_column(String(500), nullable=False, default="", server_default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    user: Mapped["User"] = relationship()
