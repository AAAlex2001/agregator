"""Файлы заявки в закрытом хранилище: документация, договор, замечания, заключение, платёжки."""

from datetime import datetime
from enum import StrEnum

from sqlalchemy import DateTime, ForeignKey, Integer, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.base import Base
from app.core.clock import now


class DocumentKind(StrEnum):
    """Что за файл."""

    DOCUMENTATION = "documentation"
    COMPANY_CARD = "company_card"
    CONTRACT = "contract"
    NDA = "nda"
    REMARKS = "remarks"
    REVISION = "revision"
    CONCLUSION = "conclusion"
    PAYMENT_ORDER = "payment_order"
    GUARANTEE_LETTER = "guarantee_letter"
    AUDIT_ITEM = "audit_item"
    OPO_CERTIFICATE = "opo_certificate"
    POWER_OF_ATTORNEY = "power_of_attorney"
    STO = "sto"
    AUDIT_PLAN = "audit_plan"


class OrderDocument(Base):
    """Файл заявки. remark_id связывает файлы замечаний и исправлений с их раундом,
    item_number — документ аудита с пунктом перечня.
    """

    __tablename__ = "blitz_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("blitz_orders.id", ondelete="CASCADE"), index=True)
    remark_id: Mapped[int | None] = mapped_column(ForeignKey("blitz_remarks.id", ondelete="SET NULL"))
    uploaded_by: Mapped[int | None] = mapped_column(ForeignKey("accounts.id", ondelete="SET NULL"))
    kind: Mapped[str] = mapped_column(String(24))
    item_number: Mapped[int | None] = mapped_column(SmallInteger)
    path: Mapped[str] = mapped_column(String(500))
    name: Mapped[str] = mapped_column(String(255))
    size: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
