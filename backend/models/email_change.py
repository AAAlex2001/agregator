from datetime import UTC, datetime, timedelta

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from models.base import Base

CODE_TTL_MINUTES = 15


def default_expires_at() -> datetime:
    return datetime.now(UTC) + timedelta(minutes=CODE_TTL_MINUTES)


class EmailChangeRequest(Base):
    "Заявка на смену email — код, отправленный на новый адрес, ждёт подтверждения юзером."

    __tablename__ = "email_change_requests"
    __table_args__ = (
        UniqueConstraint("user_id", name="uq_email_change_requests_user"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    new_email = Column(String, nullable=False)
    code = Column(String(10), nullable=False)
    is_used = Column(Boolean, nullable=False, default=False, server_default="false")
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    expires_at = Column(
        DateTime(timezone=True),
        default=default_expires_at,
        nullable=False,
    )

    user = relationship("User")
