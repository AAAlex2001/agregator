from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.accounts.models import Account
from src.core.base import Base, utc_now


def new_session_id() -> str:
    """Придумывает случайный id сессии для cookie."""
    return str(uuid4())


class Session(Base):
    """Сессия входа. Её можно продлевать до expires_at, но не дольше max_expires_at."""

    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String, unique=True, default=new_session_id)
    user_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    max_expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    user: Mapped[Account] = relationship(lazy="selectin")
