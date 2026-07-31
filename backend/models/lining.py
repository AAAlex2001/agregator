from datetime import UTC, datetime
from typing import Any

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class LiningFactor(Base):
    "Фактор риска R0/R2/R7 для оценки крепи горных выработок."
    __tablename__ = "lining_factors"

    id: Mapped[int] = mapped_column(primary_key=True)
    profile: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(20), nullable=False)
    group_code: Mapped[str] = mapped_column(String(10), nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    max_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    default_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    options: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    __table_args__ = (
        UniqueConstraint("profile", "code", name="uq_lining_factor_profile_code"),
    )


class LiningReport(Base):
    "Сохранённый расчёт оценки крепи эксперта: входные данные + итог. PDF пересобирается из них."
    __tablename__ = "lining_reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    expert_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    selections: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    element_categories: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    expert_scores: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    service_life_years: Mapped[float] = mapped_column(Float, nullable=False, default=5.0)
    header: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    blocks: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=list)
    overall_r: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    overall_category: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    final_capital: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    final_emergency: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
