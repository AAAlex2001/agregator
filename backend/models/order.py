from datetime import datetime, timezone
from enum import Enum as PyEnum
from uuid import uuid4

from sqlalchemy import (
    Column,
    Integer,
    BigInteger,
    String,
    Text,
    Date,
    DateTime,
    ForeignKey,
    Enum,
    JSON,
)
from sqlalchemy.orm import relationship

from models.base import Base


class OrderStatus(str, PyEnum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"


class BadgeVariant(str, PyEnum):
    BLUE = "BLUE"
    GREEN = "GREEN"
    GRAY = "GRAY"
    ORANGE = "ORANGE"
    BROWN = "BROWN"
    PURPLE = "PURPLE"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(36), unique=True, nullable=False, default=lambda: str(uuid4()), index=True)
    title = Column(String(500), nullable=False)
    company = Column(String(500), nullable=False, default="")
    typical_names = Column(String(1000), nullable=False, default="")
    comment = Column(Text, nullable=False, default="")
    customer_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    assigned_expert_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    technical_files = Column(JSON, nullable=False, default=list)
    sum_amount = Column(BigInteger, nullable=False)
    deadline = Column(Date, nullable=False)
    responses_deadline = Column(DateTime(timezone=True), nullable=True)
    status = Column(
        Enum(OrderStatus),
        nullable=False,
        index=True,
        default=OrderStatus.ACTIVE,
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    customer = relationship(
        "User",
        foreign_keys=[customer_id],
        back_populates="orders",
    )
    assigned_expert = relationship(
        "User",
        foreign_keys=[assigned_expert_id],
        back_populates="assigned_orders",
    )
    badges = relationship(
        "OrderBadge",
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="selectin",
    )
    responses = relationship(
        "OrderResponse",
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="selectin",
    )
    chats = relationship(
        "Chat",
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="selectin",
    )


class OrderBadge(Base):
    __tablename__ = "order_badges"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(
        Integer,
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    text = Column(String(50), nullable=False)
    variant = Column(Enum(BadgeVariant), nullable=False)

    order = relationship("Order", back_populates="badges")
