"""Детали заявок по направлениям: по таблице на направление, 1:1 к orders."""
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.order import Order


class OrderCadastralDetails(Base):
    """Дополнительные поля заявки на кадастровые работы."""
    __tablename__ = "order_cadastral_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    work_location: Mapped[str] = mapped_column(String(500), nullable=False)

    order: Mapped["Order"] = relationship(back_populates="cadastral_details")


class OrderForensicDetails(Base):
    """Дополнительные поля заявки на судебную экспертизу."""
    __tablename__ = "order_forensic_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    government_body: Mapped[str] = mapped_column(String(500), nullable=False)
    expert_requirements: Mapped[str] = mapped_column(Text, nullable=False)
    subject_location: Mapped[str] = mapped_column(String(500), nullable=False)

    order: Mapped["Order"] = relationship(back_populates="forensic_details")
