from datetime import datetime, timezone

from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, UniqueConstraint
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
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    answered_at = Column(DateTime(timezone=True), nullable=True)

    order = relationship("Order", backref="questions")
    expert = relationship("User")
