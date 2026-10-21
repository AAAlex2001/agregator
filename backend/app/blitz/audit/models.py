"""Аудиторская группа заявки."""

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base
from models.account import Account


class AuditTeamMember(Base):
    """Аудитор в группе заявки. Руководитель группы — эксперт заявки, здесь только остальные."""

    __tablename__ = "blitz_audit_team"

    order_id: Mapped[int] = mapped_column(ForeignKey("blitz_orders.id", ondelete="CASCADE"), primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), primary_key=True)

    account: Mapped[Account] = relationship(lazy="joined")
