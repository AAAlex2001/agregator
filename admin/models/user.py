from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import BigInteger, Column, Integer, Numeric, String, Boolean, DateTime, Enum, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from models.base import Base


class UserRole(str, PyEnum):
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"
    LICENSE_HOLDER = "LICENSE_HOLDER"

    def __str__(self):
        labels = {
            "CUSTOMER": "Заказчик",
            "EXPERT": "Эксперт",
            "LICENSE_HOLDER": "Держатель лицензии",
        }
        return labels.get(self.value, self.value)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(Enum(UserRole), nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    inn = Column(String(12), index=True, nullable=True)
    company_data = Column(JSONB, nullable=True)
    email = Column(String, index=True, nullable=True)
    email_on_response_created = Column(Boolean, default=True, nullable=False, server_default="true")
    email_on_response_updated = Column(Boolean, default=True, nullable=False, server_default="true")
    email_on_expert_rejected = Column(Boolean, default=True, nullable=False, server_default="true")
    notify_order_types = Column(JSONB, nullable=True)
    email_on_order_updated = Column(Boolean, default=True, nullable=False, server_default="true")
    email_on_bidding_finished = Column(Boolean, default=True, nullable=False, server_default="true")
    email_on_chat_message = Column(Boolean, default=True, nullable=False, server_default="true")
    phone = Column(String, index=True, nullable=True)
    avatar_url = Column(String, nullable=True)
    password = Column(String, nullable=False)
    rating = Column(Numeric(2, 1), nullable=True)
    review_count = Column(Integer, default=0, nullable=False)
    notification_unread_count = Column(Integer, default=0, nullable=False, server_default="0")
    license_number = Column(String(100), nullable=True)
    license_file_url = Column(String(500), nullable=True)
    license_areas = Column(JSONB, nullable=True)
    license_rental_kind = Column(String(20), nullable=True)
    license_rental_percent = Column(Numeric(5, 2), nullable=True)
    license_rental_fixed_amount = Column(BigInteger, nullable=True)
    company_card_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        CheckConstraint("(email IS NOT NULL OR phone IS NOT NULL)", name="user_email_or_phone_required"),
        UniqueConstraint("inn", "role", name="uq_users_inn_role"),
        UniqueConstraint("email", "role", name="uq_users_email_role"),
        UniqueConstraint("phone", "role", name="uq_users_phone_role"),
    )

    password_reset_codes = relationship("PasswordResetCode", back_populates="user", passive_deletes=True)
    orders = relationship("Order", foreign_keys="Order.customer_id", back_populates="customer", passive_deletes=True)
    assigned_orders = relationship("Order", foreign_keys="Order.assigned_expert_id", back_populates="assigned_expert", passive_deletes=True)
    responses = relationship("OrderResponse", back_populates="expert", passive_deletes=True)
    customer_chats = relationship("Chat", foreign_keys="Chat.customer_id", back_populates="customer", passive_deletes=True)
    expert_chats = relationship("Chat", foreign_keys="Chat.expert_id", back_populates="expert", passive_deletes=True)
    chat_messages = relationship("ChatMessage", back_populates="sender", passive_deletes=True)
    payments = relationship("Payment", back_populates="user", passive_deletes=True)
    subscriptions = relationship("UserSubscription", back_populates="user", passive_deletes=True)
    customer_reviews = relationship("Review", foreign_keys="Review.customer_id", back_populates="customer", passive_deletes=True)
    expert_reviews = relationship("Review", foreign_keys="Review.expert_id", back_populates="expert", passive_deletes=True)
    support_tickets = relationship("SupportTicket", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)

    def __str__(self):
        name = " ".join(filter(None, [self.first_name, self.last_name]))
        contact = self.email or self.phone or f"id:{self.id}"
        return f"{name} ({contact})" if name else contact
