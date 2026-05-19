from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import Column, Integer, BigInteger, String, Text, Date, DateTime, ForeignKey, Enum, JSON, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship

from models.base import Base


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
    __tablename__ = "order_responses"
    __table_args__ = (
        UniqueConstraint("order_id", "expert_id", name="uq_order_responses_order_expert"),
    )

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(
        Integer,
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    expert_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    comment = Column(Text, nullable=False, default="")
    proposed_sum_amount = Column(BigInteger, nullable=False)
    proposed_start_date = Column(Date, nullable=True)
    proposed_deadline = Column(Date, nullable=False)
    previous_comment = Column(Text, nullable=True)
    previous_proposed_sum_amount = Column(BigInteger, nullable=True)
    previous_proposed_start_date = Column(Date, nullable=True)
    previous_proposed_deadline = Column(Date, nullable=True)
    technical_files = Column(JSON, nullable=False, default=list)
    previous_technical_files = Column(JSON, nullable=True)
    expert_confirmed = Column(Boolean, nullable=False, default=False, server_default="false")
    auto_rejected = Column(Boolean, nullable=False, default=False, server_default="false")
    rejection_reason = Column(Text, nullable=True)
    expert_inn = Column(String(12), nullable=True, index=True)
    expert_company_data = Column(JSON, nullable=True)
    vat_kind = Column(
        Enum(VatKind, name="vatkind"),
        nullable=False,
        default=VatKind.NONE,
        server_default=VatKind.NONE.value,
    )
    previous_vat_kind = Column(
        Enum(VatKind, name="vatkind"),
        nullable=True,
    )
    status = Column(
        Enum(ResponseStatus, name="responsestatus"),
        nullable=False,
        index=True,
        default=ResponseStatus.REVIEW,
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

    order = relationship("Order", back_populates="responses")
    expert = relationship("User", back_populates="responses")
    reviews = relationship("Review", back_populates="response", lazy="select")
