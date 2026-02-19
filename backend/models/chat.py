from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from models.base import Base


class Chat(Base):
    __tablename__ = "chats"
    __table_args__ = (
        UniqueConstraint("order_id", "customer_id", "expert_id", name="uq_chats_order_customer_expert"),
    )

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    expert_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    order = relationship("Order", back_populates="chats")
    customer = relationship("User", foreign_keys=[customer_id], back_populates="customer_chats")
    expert = relationship("User", foreign_keys=[expert_id], back_populates="expert_chats")
    messages = relationship(
        "ChatMessage",
        back_populates="chat",
        cascade="all, delete-orphan",
        lazy="noload",
        order_by="ChatMessage.created_at.asc()",
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    text = Column(String(5000), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    chat = relationship("Chat", back_populates="messages")
    sender = relationship("User", back_populates="chat_messages")
