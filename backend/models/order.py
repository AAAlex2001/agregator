from datetime import UTC, datetime
from enum import Enum as PyEnum
from uuid import uuid4

from sqlalchemy import (
    JSON,
    BigInteger,
    Boolean,
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from models.base import Base


class OrderStatus(str, PyEnum):
    ACTIVE = "ACTIVE"
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
    contract_files = Column(JSON, nullable=False, default=list)
    company_files = Column(JSON, nullable=False, default=list)
    other_files = Column(JSON, nullable=False, default=list)
    requires_expert = Column(Boolean, nullable=False, default=True, server_default="true")
    requires_license = Column(Boolean, nullable=False, default=True, server_default="true")
    sum_amount = Column(BigInteger, nullable=False)
    start_date = Column(Date, nullable=True)
    deadline = Column(Date, nullable=False)
    previous_title = Column(String(500), nullable=True)
    previous_comment = Column(Text, nullable=True)
    previous_sum_amount = Column(BigInteger, nullable=True)
    previous_deadline = Column(Date, nullable=True)
    previous_technical_files = Column(JSON, nullable=True)
    previous_contract_files = Column(JSON, nullable=True)
    previous_company_files = Column(JSON, nullable=True)
    previous_other_files = Column(JSON, nullable=True)
    previous_badges = Column(JSON, nullable=True)
    responses_deadline = Column(DateTime(timezone=True), nullable=True)
    status = Column(
        Enum(OrderStatus),
        nullable=False,
        index=True,
        default=OrderStatus.ACTIVE,
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
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
    questions = relationship(
        "OrderQuestion",
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
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
