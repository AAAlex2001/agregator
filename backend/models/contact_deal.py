from datetime import UTC, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any
from uuid import uuid4

from sqlalchemy import (
    BigInteger,
    DateTime,
    Enum,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.user import User


class ContactDealStatus(str, PyEnum):
    AWAITING_BUYER_SIGNATURE = "AWAITING_BUYER_SIGNATURE"
    AWAITING_SELLER_SIGNATURE = "AWAITING_SELLER_SIGNATURE"
    AWAITING_PAYMENT = "AWAITING_PAYMENT"
    PAYMENT_REPORTED = "PAYMENT_REPORTED"
    PAYMENT_REJECTED = "PAYMENT_REJECTED"
    CONTACTS_RELEASED = "CONTACTS_RELEASED"
    CANCELED = "CANCELED"


class ContactDealParty(str, PyEnum):
    SELLER = "SELLER"
    BUYER = "BUYER"


class ContactSignatureMethod(str, PyEnum):
    PASSWORD = "PASSWORD"
    TELEGRAM = "TELEGRAM"


class ContactDealReleaseActor(str, PyEnum):
    SELLER = "SELLER"
    ADMIN = "ADMIN"


class ContactReceiptStatus(str, PyEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SUPERSEDED = "SUPERSEDED"


class ContactAccessDeal(Base):
    __tablename__ = "contact_access_deals"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    public_id: Mapped[str] = mapped_column(
        String(36), unique=True, nullable=False, default=lambda: str(uuid4()), index=True
    )
    seller_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    buyer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    status: Mapped[ContactDealStatus] = mapped_column(
        Enum(ContactDealStatus, name="contactdealstatus"),
        nullable=False,
        default=ContactDealStatus.AWAITING_BUYER_SIGNATURE,
        index=True,
    )
    price_kopecks: Mapped[int] = mapped_column(BigInteger, nullable=False)
    payment_details_encrypted: Mapped[str] = mapped_column(Text, nullable=False)
    seller_contacts_encrypted: Mapped[str] = mapped_column(Text, nullable=False)
    contract_snapshot: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    contract_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    buyer_reported_paid_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    seller_confirmed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    released_by: Mapped[ContactDealReleaseActor | None] = mapped_column(
        Enum(ContactDealReleaseActor, name="contactdealreleaseactor"), nullable=True
    )
    release_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )

    seller: Mapped["User"] = relationship(foreign_keys=[seller_id])
    buyer: Mapped["User"] = relationship(foreign_keys=[buyer_id])
    signatures: Mapped[list["ContactDealSignature"]] = relationship(
        back_populates="deal", cascade="all, delete-orphan", passive_deletes=True
    )
    receipts: Mapped[list["ContactPaymentReceipt"]] = relationship(
        back_populates="deal", cascade="all, delete-orphan", passive_deletes=True
    )

    __table_args__ = (
        UniqueConstraint("seller_id", "buyer_id", name="uq_contact_deal_seller_buyer"),
    )


class ContactDealSignature(Base):
    __tablename__ = "contact_deal_signatures"

    id: Mapped[int] = mapped_column(primary_key=True)
    deal_id: Mapped[int] = mapped_column(
        ForeignKey("contact_access_deals.id", ondelete="CASCADE"), nullable=False, index=True
    )
    signer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    party: Mapped[ContactDealParty] = mapped_column(
        Enum(ContactDealParty, name="contactdealparty"), nullable=False
    )
    method: Mapped[ContactSignatureMethod] = mapped_column(
        Enum(ContactSignatureMethod, name="contactsignaturemethod"), nullable=False
    )
    document_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    signer_name: Mapped[str] = mapped_column(String(500), nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(500), nullable=True)
    session_id_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    signed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC)
    )

    deal: Mapped["ContactAccessDeal"] = relationship(back_populates="signatures")
    signer: Mapped["User"] = relationship()

    __table_args__ = (
        UniqueConstraint("deal_id", "party", name="uq_contact_deal_signature_party"),
    )


class ContactPaymentReceipt(Base):
    __tablename__ = "contact_payment_receipts"

    id: Mapped[int] = mapped_column(primary_key=True)
    public_id: Mapped[str] = mapped_column(
        String(36), unique=True, nullable=False, default=lambda: str(uuid4()), index=True
    )
    deal_id: Mapped[int] = mapped_column(
        ForeignKey("contact_access_deals.id", ondelete="CASCADE"), nullable=False, index=True
    )
    uploader_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False, unique=True)
    original_name: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[ContactReceiptStatus] = mapped_column(
        Enum(ContactReceiptStatus, name="contactreceiptstatus"),
        nullable=False,
        default=ContactReceiptStatus.PENDING,
        index=True,
    )
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC)
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    deal: Mapped["ContactAccessDeal"] = relationship(back_populates="receipts")
    uploader: Mapped["User"] = relationship()
