"""Заявка Блиц-эксперта: что проверить, кто заказчик, цена, исполнитель и путь по статусам.

Исполнитель по договору — компания платформы, эксперт выполняет работу. Заказчик назначает цену,
эксперт берёт заявку, если согласен с ней. Дальше договор, аванс 50 %, работа с замечаниями,
остаток, заключение и приёмка. Каждая смена статуса пишется в историю.
"""

from datetime import date, datetime
from decimal import Decimal
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base
from app.core.clock import now
from models.account import Account

if TYPE_CHECKING:
    from app.blitz.billing.models import Invoice
    from app.blitz.documents.models import OrderDocument
    from app.blitz.pricing.models import PriceChange
    from app.blitz.work.models import OrderRemark


class ServiceKind(StrEnum):
    """Что заказали: экспертизу промышленной безопасности или аудит СУПБ."""

    EXPERTISE = "expertise"
    AUDIT = "audit"


class OrderStatus(StrEnum):
    """Путь заявки.

    new — ждёт эксперта; expert_ready — эксперт готов, ждём подписи договора;
    contract — договор подписан, ждём аванс; in_progress — эксперт работает;
    remarks — замечания, ждём исправленную документацию; conclusion_ready — заключение готово,
    ждём остаток; paid — оплачено полностью, эксперт отправляет заключение;
    sent — заключение у заказчика; accepted — работа принята; canceled — заявка отменена.
    """

    NEW = "new"
    EXPERT_READY = "expert_ready"
    CONTRACT = "contract"
    IN_PROGRESS = "in_progress"
    REMARKS = "remarks"
    CONCLUSION_READY = "conclusion_ready"
    PAID = "paid"
    SENT = "sent"
    ACCEPTED = "accepted"
    CANCELED = "canceled"


class CustomerType(StrEnum):
    """Кто заказчик. Организация и ИП платят по счёту, физлицо — картой."""

    LEGAL = "legal"
    ENTREPRENEUR = "entrepreneur"
    INDIVIDUAL = "individual"


class ConclusionResult(StrEnum):
    """Исход экспертизы."""

    POSITIVE = "positive"
    NEGATIVE = "negative"


class Actor(StrEnum):
    """Кто сменил статус."""

    CUSTOMER = "customer"
    EXPERT = "expert"
    ADMIN = "admin"
    SYSTEM = "system"


COMPANY_CUSTOMERS = frozenset({CustomerType.LEGAL, CustomerType.ENTREPRENEUR})
FINISHED = frozenset({OrderStatus.ACCEPTED, OrderStatus.CANCELED})


class BlitzOrder(Base):
    """Заявка заказчика. Пустые объект, область и категория значат «заказчик не знает».

    paid_amount — сколько уже оплачено картой и по счетам: остаток считается от него,
    поэтому смена цены после аванса не ломает расчёт.
    """

    __tablename__ = "blitz_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    service: Mapped[str] = mapped_column(String(16), default=ServiceKind.EXPERTISE, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), index=True)
    expert_id: Mapped[int | None] = mapped_column(
        ForeignKey("accounts.id", ondelete="SET NULL"),
        index=True,
    )

    object_code: Mapped[str | None] = mapped_column(String(8))
    area_code: Mapped[str | None] = mapped_column(String(8))
    hazard_class: Mapped[int | None] = mapped_column(SmallInteger)
    expert_category: Mapped[int | None] = mapped_column(SmallInteger)
    deadline: Mapped[str] = mapped_column(String(16))
    object_name: Mapped[str] = mapped_column(String(500))
    contract_kind: Mapped[str | None] = mapped_column(String(32))
    customer_type: Mapped[str] = mapped_column(String(16))
    comment: Mapped[str | None] = mapped_column(Text)

    status: Mapped[str] = mapped_column(String(24), default=OrderStatus.NEW, index=True)
    result: Mapped[str | None] = mapped_column(String(16))
    cancel_reason: Mapped[str | None] = mapped_column(Text)

    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    paid_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal(0), server_default="0")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)

    customer: Mapped[Account] = relationship(foreign_keys=[customer_id], lazy="joined")
    expert: Mapped[Account | None] = relationship(foreign_keys=[expert_id], lazy="joined")
    company: Mapped["OrderCompany | None"] = relationship(
        lazy="selectin",
        cascade="all, delete-orphan",
        uselist=False,
    )
    individual: Mapped["OrderIndividual | None"] = relationship(
        lazy="selectin",
        cascade="all, delete-orphan",
        uselist=False,
    )
    history: Mapped[list["StatusChange"]] = relationship(
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="StatusChange.id",
    )
    documents: Mapped[list["OrderDocument"]] = relationship(
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="OrderDocument.id",
    )
    remarks: Mapped[list["OrderRemark"]] = relationship(
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="OrderRemark.id",
    )
    invoices: Mapped[list["Invoice"]] = relationship(
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="Invoice.id",
    )
    price_changes: Mapped[list["PriceChange"]] = relationship(
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="PriceChange.id",
    )

    __table_args__ = (
        CheckConstraint("price > 0", name="ck_blitz_orders_price_positive"),
        CheckConstraint("paid_amount >= 0", name="ck_blitz_orders_paid_amount"),
    )

    def move_to(self, status: OrderStatus, actor: Actor, note: str | None = None) -> None:
        """Сменить статус и записать шаг в историю."""

        self.status = status
        self.history.append(StatusChange(status=status, actor=actor, note=note, created_at=now()))

    def reached_at(self, status: OrderStatus) -> datetime | None:
        """Когда заявка последний раз пришла в этот статус."""

        moments = [change.created_at for change in self.history if change.status == status]

        return moments[-1] if moments else None


class StatusChange(Base):
    """Шаг истории: какой статус, кто перевёл и почему."""

    __tablename__ = "blitz_status_changes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("blitz_orders.id", ondelete="CASCADE"), index=True)
    status: Mapped[str] = mapped_column(String(24))
    actor: Mapped[str] = mapped_column(String(16))
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class OrderCompany(Base):
    """Реквизиты организации или ИП в заявке: по ним составляются договор, счёт и акт."""

    __tablename__ = "blitz_order_companies"

    order_id: Mapped[int] = mapped_column(
        ForeignKey("blitz_orders.id", ondelete="CASCADE"),
        primary_key=True,
    )
    full_name: Mapped[str] = mapped_column(String(500))
    name: Mapped[str] = mapped_column(String(255))
    inn: Mapped[str] = mapped_column(String(12))
    kpp: Mapped[str | None] = mapped_column(String(9))
    ogrn: Mapped[str] = mapped_column(String(15))
    address: Mapped[str] = mapped_column(String(500))
    bank: Mapped[str] = mapped_column(String(255))
    bic: Mapped[str] = mapped_column(String(9))
    account: Mapped[str] = mapped_column(String(20))
    corr_account: Mapped[str] = mapped_column(String(20))
    signer_position: Mapped[str] = mapped_column(String(255))
    signer_name: Mapped[str] = mapped_column(String(255))
    signer_genitive: Mapped[str] = mapped_column(String(500))
    signer_basis: Mapped[str] = mapped_column(String(255))


class OrderIndividual(Base):
    """Данные заказчика-физлица в заявке: попадают в договор и акт."""

    __tablename__ = "blitz_order_individuals"

    order_id: Mapped[int] = mapped_column(
        ForeignKey("blitz_orders.id", ondelete="CASCADE"),
        primary_key=True,
    )
    full_name: Mapped[str] = mapped_column(String(255))
    passport_number: Mapped[str] = mapped_column(String(11))
    passport_issued_by: Mapped[str] = mapped_column(String(500))
    passport_issued_at: Mapped[date] = mapped_column(Date)
    address: Mapped[str] = mapped_column(String(500))
