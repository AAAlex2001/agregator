"""Аудиторская группа заявки и руководители групп, которых назначает администратор."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base
from app.core.clock import now
from models.account import Account


class AuditTeamMember(Base):
    """Аудитор в группе заявки. Руководитель группы — эксперт заявки, здесь только остальные."""

    __tablename__ = "blitz_audit_team"

    order_id: Mapped[int] = mapped_column(ForeignKey("blitz_orders.id", ondelete="CASCADE"), primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), primary_key=True)

    account: Mapped[Account] = relationship(lazy="joined")


class AuditLead(Base):
    """Аудитор, который может брать заявки на аудит и руководить группой."""

    __tablename__ = "blitz_audit_leads"

    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
