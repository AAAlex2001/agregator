from datetime import UTC, date, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any
from uuid import uuid4

from sqlalchemy import (
    JSON,
    BigInteger,
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account
    from models.chat import Chat
    from models.order_details import OrderCadastralDetails, OrderForensicDetails
    from models.question import OrderQuestion
    from models.response import OrderResponse


class OrderStatus(str, PyEnum):
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"


class OrderWorkType(str, PyEnum):
    EXPERTISE = "EXPERTISE"
    DESIGN_SURVEY = "DESIGN_SURVEY"
    INSPECTION_TESTING = "INSPECTION_TESTING"
    RESEARCH_LAB = "RESEARCH_LAB"
    CADASTRAL = "CADASTRAL"
    FORENSIC = "FORENSIC"
    OTHER = "OTHER"


class BadgeVariant(str, PyEnum):
    BLUE = "BLUE"
    GREEN = "GREEN"
    GRAY = "GRAY"
    ORANGE = "ORANGE"
    BROWN = "BROWN"
    PURPLE = "PURPLE"


class Order(Base):
    """Заказ заказчика."""
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, default=lambda: str(uuid4()), index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    company: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    comment: Mapped[str] = mapped_column(Text, nullable=False, default="")
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    assigned_expert_id: Mapped[int | None] = mapped_column(
        ForeignKey("accounts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    technical_files: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    contract_files: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    company_files: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    other_files: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    requires_expert: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
    requires_license: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
    work_type: Mapped[OrderWorkType] = mapped_column(
        Enum(OrderWorkType),
        nullable=False,
        default=OrderWorkType.EXPERTISE,
        server_default=OrderWorkType.EXPERTISE.value,
    )
    sum_amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    deadline: Mapped[date] = mapped_column(Date, nullable=False)
    previous_title: Mapped[str | None] = mapped_column(String(500), nullable=True)
    previous_comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    previous_sum_amount: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    previous_deadline: Mapped[date | None] = mapped_column(Date, nullable=True)
    previous_technical_files: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)
    previous_contract_files: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)
    previous_company_files: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)
    previous_other_files: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)
    previous_badges: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)
    responses_deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus),
        nullable=False,
        index=True,
        default=OrderStatus.ACTIVE,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    customer: Mapped["Account"] = relationship(
        foreign_keys=[customer_id],
        back_populates="orders",
    )
    assigned_expert: Mapped["Account | None"] = relationship(
        foreign_keys=[assigned_expert_id],
        back_populates="assigned_orders",
    )
    badges: Mapped[list["OrderBadge"]] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="selectin",
    )
    responses: Mapped[list["OrderResponse"]] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="selectin",
    )
    chats: Mapped[list["Chat"]] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="selectin",
    )
    questions: Mapped[list["OrderQuestion"]] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    cadastral_details: Mapped["OrderCadastralDetails | None"] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
        lazy="selectin",
    )
    forensic_details: Mapped["OrderForensicDetails | None"] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
        lazy="selectin",
    )


class OrderBadge(Base):
    """Бейдж/метка на карточке заказа."""
    __tablename__ = "order_badges"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    text: Mapped[str] = mapped_column(String(50), nullable=False)
    variant: Mapped[BadgeVariant] = mapped_column(Enum(BadgeVariant), nullable=False)

    order: Mapped["Order"] = relationship(back_populates="badges")
