"""Раунд замечаний эксперта: текст и файлы, ответ заказчика с исправленной документацией."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base
from app.core.clock import now

if TYPE_CHECKING:
    from app.blitz.documents.models import OrderDocument


class OrderRemark(Base):
    """Замечания закрываются, когда заказчик присылает исправленную документацию."""

    __tablename__ = "blitz_remarks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("blitz_orders.id", ondelete="CASCADE"), index=True)
    text: Mapped[str | None] = mapped_column(Text)
    response_text: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    documents: Mapped[list["OrderDocument"]] = relationship(lazy="selectin", order_by="OrderDocument.id")
