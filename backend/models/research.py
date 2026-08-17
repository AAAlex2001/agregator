"""НИР: анкета исполнителя (1:1 к experts) и поля заявки (1:1 к orders)."""
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.applicant import ApplicantColumns
from models.base import Base

if TYPE_CHECKING:
    from models.expert import Expert
    from models.order import Order


class ExpertResearchProfile(Base):
    """Анкета исполнителя НИР: учёная степень, звание, направление научной деятельности."""
    __tablename__ = "expert_research_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    expert_id: Mapped[int] = mapped_column(
        ForeignKey("experts.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    academic_degree: Mapped[str] = mapped_column(String(300), nullable=False, default="", server_default="")
    science_branch: Mapped[str] = mapped_column(String(100), nullable=False, default="", server_default="")
    academic_title: Mapped[str] = mapped_column(String(300), nullable=False, default="", server_default="")
    research_field: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    expert: Mapped["Expert"] = relationship(back_populates="research_profile")


class OrderResearchDetails(ApplicantColumns, Base):
    """Поля заявки на проведение НИР: заявитель, требования к исполнителю, выезд на объект."""
    __tablename__ = "order_research_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    executor_requirements: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    needs_site_visit: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")

    order: Mapped["Order"] = relationship(back_populates="research_details")
