from typing import Any

from sqlalchemy import Float, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class HazardFactor(Base):
    "Фактор оценки опасности аварий (R0–R9) для профиля рудник/шахта."
    __tablename__ = "hazard_factors"

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
        UniqueConstraint("profile", "code", name="uq_hazard_factor_profile_code"),
    )
