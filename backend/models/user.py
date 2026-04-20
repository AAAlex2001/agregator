"""
Модели пользователя
"""
from datetime import datetime, timezone
from enum import Enum as PyEnum
from uuid import uuid4

from sqlalchemy import JSON, Column, Integer, Numeric, String, Boolean, DateTime, BigInteger, Enum, CheckConstraint
from sqlalchemy.orm import relationship

from models.base import Base


class UserRole(str, PyEnum):
    """Роли пользователей в системе"""
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"


class User(Base):
    """Пользователь системы"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(36), unique=True, nullable=False, default=lambda: str(uuid4()), index=True)
    role = Column(Enum(UserRole),  nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    inn = Column(String(12), index=True, unique=True, nullable=True)
    company_data = Column(JSON, nullable=True)
    email = Column(String, index=True, unique=True, nullable=True)
    phone = Column(String, index=True, unique=True, nullable=True)
    avatar_url = Column(String, nullable=True)
    password = Column(String, nullable=False)
    notification_unread_count = Column(Integer, default=0, nullable=False, server_default="0")
    balance = Column(BigInteger, default=0, nullable=False)
    rating = Column(Numeric(2, 1), nullable=True)
    review_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "(email IS NOT NULL OR phone IS NOT NULL)",
            name="user_email_or_phone_required"
        ),
    )

    password_reset_codes = relationship(
        "PasswordResetCode",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    orders = relationship(
        "Order",
        foreign_keys="Order.customer_id",
        back_populates="customer",
        cascade="all, delete-orphan"
    )

    assigned_orders = relationship(
        "Order",
        foreign_keys="Order.assigned_expert_id",
        back_populates="assigned_expert",
    )

    responses = relationship(
        "OrderResponse",
        back_populates="expert",
        cascade="all, delete-orphan"
    )

    customer_chats = relationship(
        "Chat",
        foreign_keys="Chat.customer_id",
        back_populates="customer",
        cascade="all, delete-orphan",
    )

    expert_chats = relationship(
        "Chat",
        foreign_keys="Chat.expert_id",
        back_populates="expert",
        cascade="all, delete-orphan",
    )

    chat_messages = relationship(
        "ChatMessage",
        back_populates="sender",
        cascade="all, delete-orphan",
    )

    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    payments = relationship(
        "Payment",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    customer_reviews = relationship(
        "Review",
        foreign_keys="Review.customer_id",
        back_populates="customer",
        cascade="all, delete-orphan",
    )

    expert_reviews = relationship(
        "Review",
        foreign_keys="Review.expert_id",
        back_populates="expert",
        cascade="all, delete-orphan",
    )
