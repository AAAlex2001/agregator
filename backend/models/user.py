"""
Модели пользователя
"""
from datetime import UTC, datetime
from decimal import Decimal
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any
from uuid import uuid4

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.chat import Chat, ChatMessage
    from models.notification import Notification
    from models.order import Order
    from models.password_reset_code import PasswordResetCode
    from models.payment import Payment
    from models.pricing import UserSubscription
    from models.response import OrderResponse
    from models.review import Review
    from models.support_ticket import SupportTicket


class UserRole(str, PyEnum):
    """Роли пользователей в системе"""
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"
    LICENSE_HOLDER = "LICENSE_HOLDER"


class LicenseRentalKind(str, PyEnum):
    """Способ расчёта стоимости аренды лицензии"""
    PERCENT = "PERCENT"
    FIXED = "FIXED"
    NEGOTIABLE = "NEGOTIABLE"


class User(Base):
    """Пользователь системы"""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, default=lambda: str(uuid4()), index=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    first_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    inn: Mapped[str | None] = mapped_column(String(12), index=True, nullable=True)
    company_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    email: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    email_on_response_created: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_response_updated: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_expert_rejected: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    notify_order_types: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    email_on_order_updated: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_bidding_finished: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_chat_message: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_question_asked: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_question_answered: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_new_blog_post: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    notifications_introduced: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false")
    phone: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String, nullable=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    notification_unread_count: Mapped[int] = mapped_column(default=0, nullable=False, server_default="0")
    rating: Mapped[Decimal | None] = mapped_column(Numeric(2, 1), nullable=True)
    review_count: Mapped[int] = mapped_column(default=0, nullable=False)
    license_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    license_file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    license_areas: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    mining_license_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    mining_license_file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    sro_design_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sro_design_file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    lab_accreditation_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    lab_accreditation_file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    license_rental_kind: Mapped[str | None] = mapped_column(String(20), nullable=True)
    license_rental_percent: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True)
    license_rental_fixed_amount: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    company_card_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "(email IS NOT NULL OR phone IS NOT NULL)",
            name="user_email_or_phone_required"
        ),
        CheckConstraint(
            "license_rental_kind IS NULL OR license_rental_kind IN ('PERCENT', 'FIXED', 'NEGOTIABLE')",
            name="user_license_rental_kind_valid",
        ),
        UniqueConstraint("email", "role", name="uq_users_email_role"),
        UniqueConstraint("phone", "role", name="uq_users_phone_role"),
        UniqueConstraint("inn", "role", name="uq_users_inn_role"),
    )

    password_reset_codes: Mapped[list["PasswordResetCode"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    orders: Mapped[list["Order"]] = relationship(
        foreign_keys="Order.customer_id",
        back_populates="customer",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    assigned_orders: Mapped[list["Order"]] = relationship(
        foreign_keys="Order.assigned_expert_id",
        back_populates="assigned_expert",
        passive_deletes=True,
    )

    responses: Mapped[list["OrderResponse"]] = relationship(
        back_populates="expert",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    customer_chats: Mapped[list["Chat"]] = relationship(
        foreign_keys="Chat.customer_id",
        back_populates="customer",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    expert_chats: Mapped[list["Chat"]] = relationship(
        foreign_keys="Chat.expert_id",
        back_populates="expert",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    chat_messages: Mapped[list["ChatMessage"]] = relationship(
        back_populates="sender",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    notifications: Mapped[list["Notification"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    payments: Mapped[list["Payment"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    subscriptions: Mapped[list["UserSubscription"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    customer_reviews: Mapped[list["Review"]] = relationship(
        foreign_keys="Review.customer_id",
        back_populates="customer",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    expert_reviews: Mapped[list["Review"]] = relationship(
        foreign_keys="Review.expert_id",
        back_populates="expert",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    support_tickets: Mapped[list["SupportTicket"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
