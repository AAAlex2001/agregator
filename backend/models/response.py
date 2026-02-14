from datetime import datetime, timezone, date
from enum import Enum as PyEnum

from sqlalchemy import Column, Integer, Text, Date, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship

from models.base import Base


class ResponseStatus(str, PyEnum):
    REVIEW = "REVIEW"
    REJECTED = "REJECTED"
    ACCEPTED = "ACCEPTED"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"


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
    proposed_sum_amount = Column(Integer, nullable=False)
    proposed_deadline = Column(Date, nullable=False)
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
