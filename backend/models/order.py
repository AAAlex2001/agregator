from datetime import datetime, timezone, date
from enum import Enum as PyEnum

from sqlalchemy import (
    Column,
    Integer,
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


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    comment = Column(Text, nullable=False, default="")
    customer_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    technical_files = Column(JSON, nullable=False, default=list)
    sum_amount = Column(Integer, nullable=False)
    deadline = Column(Date, nullable=False)
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

    customer = relationship("User", back_populates="orders")
    badges = relationship(
        "OrderBadge",
        back_populates="order",
        cascade="all, delete-orphan",
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
