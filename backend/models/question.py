from datetime import UTC, datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from models.base import Base


class OrderQuestion(Base):
    __tablename__ = "order_questions"
    __table_args__ = (
        UniqueConstraint("order_id", "expert_id", name="uq_order_questions_order_expert"),
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
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    asked_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    answered_at = Column(DateTime(timezone=True), nullable=True)
    is_anonymous = Column(Boolean, nullable=False, default=True, server_default="true")

    order = relationship("Order", back_populates="questions")
    expert = relationship("User")
