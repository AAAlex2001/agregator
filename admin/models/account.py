from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.chat import Chat, ChatMessage
    from models.customer import Customer
    from models.expert import Expert
    from models.license_holder import LicenseHolder
    from models.order import Order
    from models.password_reset_code import PasswordResetCode
    from models.payment import Payment
    from models.pricing import UserSubscription
    from models.response import OrderResponse
    from models.review import Review
    from models.support_ticket import SupportTicket


class UserRole(str, PyEnum):
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"
    LICENSE_HOLDER = "LICENSE_HOLDER"

    def __str__(self) -> str:
        labels = {
            "CUSTOMER": "Заказчик",
            "EXPERT": "Исполнитель",
            "LICENSE_HOLDER": "Держатель разрешительных документов",
        }
        return labels.get(self.value, self.value)


class Account(Base):
    "Учётная запись: вход в систему и данные, общие для всех ролей."
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, index=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    email: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    phone: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    telegram_id: Mapped[int | None] = mapped_column(BigInteger, index=True, nullable=True)
    first_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    inn: Mapped[str | None] = mapped_column(String(12), index=True, nullable=True)
    company_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String, nullable=True)
    notify_telegram_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    notifications_introduced: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false")
    notification_unread_count: Mapped[int] = mapped_column(default=0, nullable=False, server_default="0")
    email_on_chat_message: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    email_on_new_blog_post: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    __table_args__ = (
        CheckConstraint("(email IS NOT NULL OR phone IS NOT NULL)", name="account_email_or_phone_required"),
        UniqueConstraint("email", "role", name="uq_accounts_email_role"),
        UniqueConstraint("phone", "role", name="uq_accounts_phone_role"),
    )

    customer_profile: Mapped["Customer | None"] = relationship(back_populates="account", uselist=False, lazy="selectin", passive_deletes=True)
    expert_profile: Mapped["Expert | None"] = relationship(back_populates="account", uselist=False, lazy="selectin", passive_deletes=True)
    license_holder_profile: Mapped["LicenseHolder | None"] = relationship(back_populates="account", uselist=False, lazy="selectin", passive_deletes=True)

    password_reset_codes: Mapped[list["PasswordResetCode"]] = relationship(back_populates="account", passive_deletes=True)
    orders: Mapped[list["Order"]] = relationship(foreign_keys="Order.customer_id", back_populates="customer", passive_deletes=True)
    assigned_orders: Mapped[list["Order"]] = relationship(foreign_keys="Order.assigned_expert_id", back_populates="assigned_expert", passive_deletes=True)
    responses: Mapped[list["OrderResponse"]] = relationship(back_populates="expert", passive_deletes=True)
    customer_chats: Mapped[list["Chat"]] = relationship(foreign_keys="Chat.customer_id", back_populates="customer", passive_deletes=True)
    expert_chats: Mapped[list["Chat"]] = relationship(foreign_keys="Chat.expert_id", back_populates="expert", passive_deletes=True)
    chat_messages: Mapped[list["ChatMessage"]] = relationship(back_populates="sender", passive_deletes=True)
    payments: Mapped[list["Payment"]] = relationship(back_populates="account", passive_deletes=True)
    subscriptions: Mapped[list["UserSubscription"]] = relationship(back_populates="account", passive_deletes=True)
    customer_reviews: Mapped[list["Review"]] = relationship(foreign_keys="Review.customer_id", back_populates="customer", passive_deletes=True)
    expert_reviews: Mapped[list["Review"]] = relationship(foreign_keys="Review.expert_id", back_populates="expert", passive_deletes=True)
    support_tickets: Mapped[list["SupportTicket"]] = relationship(back_populates="account", cascade="all, delete-orphan", passive_deletes=True)

    def __str__(self) -> str:
        name = " ".join(filter(None, [self.first_name, self.last_name]))
        contact = self.email or self.phone or f"id:{self.id}"
        return f"{name} ({contact})" if name else contact
