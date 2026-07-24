from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import Any

from sqlalchemy import JSON, Column, DateTime, Enum, ForeignKey, Index, Integer, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base
from models.tag import Tag


class OversightArea(str, PyEnum):
    "Направление надзора Ростехнадзора."
    INDUSTRIAL_SAFETY = "INDUSTRIAL_SAFETY"
    HYDRO_SAFETY = "HYDRO_SAFETY"
    NUCLEAR = "NUCLEAR"
    ENERGY = "ENERGY"
    MINING = "MINING"
    CONSTRUCTION = "CONSTRUCTION"
    SRO = "SRO"
    LICENSING = "LICENSING"


class Industry(str, PyEnum):
    "Отрасль / вид объектов, к которым относится разъяснение."
    COAL = "COAL"
    MINING_UNDERGROUND = "MINING_UNDERGROUND"
    OIL_GAS_EXTRACTION = "OIL_GAS_EXTRACTION"
    OIL_REFINING = "OIL_REFINING"
    PIPELINE_GAS_STORAGE = "PIPELINE_GAS_STORAGE"
    GAS_DISTRIBUTION = "GAS_DISTRIBUTION"
    METALLURGY = "METALLURGY"
    CHEMICAL = "CHEMICAL"
    DEFENSE = "DEFENSE"
    HAZMAT_TRANSPORT = "HAZMAT_TRANSPORT"
    PLANT_MATERIAL_STORAGE = "PLANT_MATERIAL_STORAGE"
    EXPLOSIVES = "EXPLOSIVES"
    PRESSURE_EQUIPMENT = "PRESSURE_EQUIPMENT"
    LIFTING_MECHANISMS = "LIFTING_MECHANISMS"
    SURVEYING_SUBSOIL = "SURVEYING_SUBSOIL"
    HAZARD_LIFTS = "HAZARD_LIFTS"
    POWER_PLANTS = "POWER_PLANTS"
    HYDRO_STRUCTURES = "HYDRO_STRUCTURES"
    CONSTRUCTION_OBJECTS = "CONSTRUCTION_OBJECTS"
    SRO_CONSTRUCTION = "SRO_CONSTRUCTION"
    SRO_ENERGY_AUDIT = "SRO_ENERGY_AUDIT"


class Activity(str, PyEnum):
    "Вид деятельности Ростехнадзора, которого касается разъяснение."
    LICENSING = "LICENSING"
    EXPERT = "EXPERT"
    OPO_REGISTRY = "OPO_REGISTRY"
    DECLARATIONS = "DECLARATIONS"
    ATTESTATION_INDUSTRIAL = "ATTESTATION_INDUSTRIAL"
    ATTESTATION_HYDRO = "ATTESTATION_HYDRO"
    ATTESTATION_COMBINED = "ATTESTATION_COMBINED"


class ObjectType(str, PyEnum):
    "Тип объекта / оборудования, к которому относится разъяснение."
    GAS_NETWORKS = "GAS_NETWORKS"
    LIFTING_STRUCTURES = "LIFTING_STRUCTURES"
    PRESSURE_EQUIPMENT = "PRESSURE_EQUIPMENT"
    POWER_OBJECTS = "POWER_OBJECTS"
    SUPPORT_STRUCTURES = "SUPPORT_STRUCTURES"
    SAFETY_SYSTEMS = "SAFETY_SYSTEMS"
    TECHNICAL_DEVICES = "TECHNICAL_DEVICES"


class DocumentType(str, PyEnum):
    "Тип документа-разъяснения."
    OFFICIAL_CLARIFICATION = "OFFICIAL_CLARIFICATION"
    INFO_LETTER = "INFO_LETTER"
    RESPONSE_TO_REQUEST = "RESPONSE_TO_REQUEST"


class ClarificationStatus(str, PyEnum):
    "Актуальность разъяснения (содержательный признак, не влияет на видимость)."
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"


class PublicationStatus(str, PyEnum):
    "Статус публикации карточки в админке. Только PUBLISHED виден на публичном сайте."
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


rtn_clarification_tags = Table(
    "rtn_clarification_tags",
    Base.metadata,
    Column("clarification_id", ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)

rtn_clarification_oversight_areas = Table(
    "rtn_clarification_oversight_areas",
    Base.metadata,
    Column("clarification_id", ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
    Column("area", Enum(OversightArea, name="rtn_oversight_area"), primary_key=True),
)

rtn_clarification_industries = Table(
    "rtn_clarification_industries",
    Base.metadata,
    Column("clarification_id", ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
    Column("industry", Enum(Industry, name="rtn_industry"), primary_key=True),
)

rtn_clarification_activities = Table(
    "rtn_clarification_activities",
    Base.metadata,
    Column("clarification_id", ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
    Column("activity", Enum(Activity, name="rtn_activity"), primary_key=True),
)

rtn_clarification_object_types = Table(
    "rtn_clarification_object_types",
    Base.metadata,
    Column("clarification_id", ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
    Column("object_type", Enum(ObjectType, name="rtn_object_type"), primary_key=True),
)


class RtnClarification(Base):
    "Официальное разъяснение Ростехнадзора: вопрос-ответ, письмо или информационное сообщение."
    __tablename__ = "rtn_clarifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    document_type: Mapped[DocumentType] = mapped_column(
        Enum(DocumentType, name="rtn_document_type"), nullable=False, index=True
    )
    status: Mapped[ClarificationStatus] = mapped_column(
        Enum(ClarificationStatus, name="rtn_clarification_status"),
        nullable=False,
        default=ClarificationStatus.ACTIVE,
        index=True,
    )
    publication_status: Mapped[PublicationStatus] = mapped_column(
        Enum(PublicationStatus, name="rtn_publication_status"),
        nullable=False,
        default=PublicationStatus.DRAFT,
        index=True,
    )

    slug: Mapped[str] = mapped_column(String(220), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    excerpt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    question_text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    answer_html: Mapped[str] = mapped_column(Text, nullable=False, default="")

    letter_number: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    department: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    source_url: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    pdf_url: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    referenced_regulations: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)

    meta_title: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    meta_description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    meta_keywords: Mapped[str] = mapped_column(Text, nullable=False, default="")

    views_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    tags: Mapped[list[Tag]] = relationship(secondary=rtn_clarification_tags, lazy="selectin", order_by="Tag.name")

    __table_args__ = (
        Index("ix_rtn_clarifications_pubstatus_published", "publication_status", "published_at"),
    )

    def __str__(self) -> str:
        return self.title or f"RtnClarification #{self.id}"
