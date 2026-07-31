from datetime import UTC, date, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any
from uuid import UUID as PyUUID
from uuid import uuid4

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.account import Account
    from models.chat import Chat


class LaborListingKind(str, PyEnum):
    EXPERT_WANTED = "EXPERT_WANTED"
    EXPERT_AVAILABLE = "EXPERT_AVAILABLE"


class EmploymentTerm(str, PyEnum):
    PERMANENT = "PERMANENT"
    FIXED = "FIXED"


class EmploymentType(str, PyEnum):
    PRIMARY = "PRIMARY"
    PART_TIME = "PART_TIME"


class CurrentJobStatus(str, PyEnum):
    NONE = "NONE"
    EMPLOYED = "EMPLOYED"


class LaborListing(Base):
    """Объявление в разделе трудовых ресурсов."""

    __tablename__ = "labor_listings"
    __table_args__ = (
        UniqueConstraint(
            "owner_id",
            "client_request_id",
            name="uq_labor_listings_owner_request",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    public_id: Mapped[str] = mapped_column(
        String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid4()),
        index=True,
    )
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    client_request_id: Mapped[PyUUID | None] = mapped_column(
        UUID(as_uuid=True),
        nullable=True,
    )
    kind: Mapped[LaborListingKind] = mapped_column(
        Enum(LaborListingKind), nullable=False, index=True
    )
    certificates: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB, nullable=False, default=list, server_default="[]"
    )
    region: Mapped[str] = mapped_column(String(300), nullable=False)
    employment_term: Mapped[EmploymentTerm] = mapped_column(
        Enum(EmploymentTerm), nullable=False
    )
    fixed_term: Mapped[str | None] = mapped_column(String(300), nullable=True)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    employment_type: Mapped[EmploymentType | None] = mapped_column(
        Enum(EmploymentType), nullable=True
    )
    current_job_status: Mapped[CurrentJobStatus | None] = mapped_column(
        Enum(CurrentJobStatus), nullable=True
    )
    other_profession: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )

    owner: Mapped["Account"] = relationship()
    chats: Mapped[list["Chat"]] = relationship(
        back_populates="labor_listing",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
