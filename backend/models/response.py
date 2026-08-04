from datetime import UTC, date, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any

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
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account
    from models.order import Order
    from models.review import Review


class ResponseStatus(str, PyEnum):
    REVIEW = "REVIEW"
    REJECTED = "REJECTED"
    ACCEPTED = "ACCEPTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    WITHDRAWN_BY_EXPERT = "WITHDRAWN_BY_EXPERT"


class VatKind(str, PyEnum):
    "Вид НДС в коммерческом предложении эксперта."
    NONE = "NONE"
    VAT_5 = "VAT_5"
    VAT_7 = "VAT_7"
    VAT_22 = "VAT_22"


class OrderResponse(Base):
    """Отклик эксперта на заказ."""
    __tablename__ = "order_responses"
    __table_args__ = (
        UniqueConstraint("order_id", "expert_id", name="uq_order_responses_order_expert"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    comment: Mapped[str] = mapped_column(Text, nullable=False, default="")
    proposed_sum_amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    proposed_start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    proposed_deadline: Mapped[date] = mapped_column(Date, nullable=False)
    previous_comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    previous_proposed_sum_amount: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    previous_proposed_start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    previous_proposed_deadline: Mapped[date | None] = mapped_column(Date, nullable=True)
    technical_files: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    previous_technical_files: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)
    expert_confirmed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    auto_rejected: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    expert_inn: Mapped[str | None] = mapped_column(String(12), nullable=True, index=True)
    expert_company_data: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    vat_kind: Mapped[VatKind] = mapped_column(
        Enum(VatKind, name="vatkind"),
        nullable=False,
        default=VatKind.NONE,
        server_default=VatKind.NONE.value,
    )
    previous_vat_kind: Mapped[VatKind | None] = mapped_column(
        Enum(VatKind, name="vatkind"),
        nullable=True,
    )
    status: Mapped[ResponseStatus] = mapped_column(
        Enum(ResponseStatus, name="responsestatus"),
        nullable=False,
        index=True,
        default=ResponseStatus.REVIEW,
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

    order: Mapped["Order"] = relationship(back_populates="responses")
    expert: Mapped["Account"] = relationship(back_populates="responses")
    reviews: Mapped[list["Review"]] = relationship(
        back_populates="response", lazy="select", passive_deletes=True
    )
