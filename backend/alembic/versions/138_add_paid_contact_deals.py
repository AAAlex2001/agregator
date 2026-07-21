"""add paid contact access deals

Revision ID: 138
Revises: 137
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "138"
down_revision: str | None = "137"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'CONTACT_ACCESS'")
    deal_status = postgresql.ENUM(
        "AWAITING_BUYER_SIGNATURE",
        "AWAITING_SELLER_SIGNATURE",
        "AWAITING_PAYMENT",
        "PAYMENT_REPORTED",
        "PAYMENT_REJECTED",
        "CONTACTS_RELEASED",
        "CANCELED",
        name="contactdealstatus",
        create_type=False,
    )
    deal_party = postgresql.ENUM("SELLER", "BUYER", name="contactdealparty", create_type=False)
    signature_method = postgresql.ENUM(
        "PASSWORD", "TELEGRAM", name="contactsignaturemethod", create_type=False
    )
    release_actor = postgresql.ENUM(
        "SELLER", "ADMIN", name="contactdealreleaseactor", create_type=False
    )
    receipt_status = postgresql.ENUM(
        "PENDING",
        "APPROVED",
        "REJECTED",
        "SUPERSEDED",
        name="contactreceiptstatus",
        create_type=False,
    )
    for enum in (deal_status, deal_party, signature_method, release_actor, receipt_status):
        enum.create(op.get_bind(), checkfirst=True)

    op.add_column(
        "users",
        sa.Column("contact_sales_enabled", sa.Boolean(), server_default=sa.false(), nullable=False),
    )
    op.add_column("users", sa.Column("contact_price_kopecks", sa.BigInteger(), nullable=True))
    op.add_column("users", sa.Column("contact_payment_details_encrypted", sa.Text(), nullable=True))
    op.add_column(
        "users",
        sa.Column("contact_disclosure_consent_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("contact_disclosure_consent_version", sa.String(30), nullable=True),
    )
    op.create_check_constraint(
        "ck_user_contact_price_positive",
        "users",
        "contact_price_kopecks IS NULL OR contact_price_kopecks > 0",
    )

    op.create_table(
        "contact_access_deals",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("public_id", sa.String(36), nullable=False),
        sa.Column("seller_id", sa.Integer(), nullable=False),
        sa.Column("buyer_id", sa.Integer(), nullable=False),
        sa.Column("status", deal_status, nullable=False),
        sa.Column("price_kopecks", sa.BigInteger(), nullable=False),
        sa.Column("payment_details_encrypted", sa.Text(), nullable=False),
        sa.Column("seller_contacts_encrypted", sa.Text(), nullable=False),
        sa.Column("contract_snapshot", postgresql.JSONB(), nullable=False),
        sa.Column("contract_hash", sa.String(64), nullable=False),
        sa.Column("buyer_reported_paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("seller_confirmed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("released_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("released_by", release_actor, nullable=True),
        sa.Column("release_note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("price_kopecks > 0", name="ck_contact_deal_price_positive"),
        sa.ForeignKeyConstraint(["seller_id"], ["users.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["buyer_id"], ["users.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("public_id"),
        sa.UniqueConstraint("seller_id", "buyer_id", name="uq_contact_deal_seller_buyer"),
    )
    for column in ("id", "public_id", "seller_id", "buyer_id", "status"):
        op.create_index(f"ix_contact_access_deals_{column}", "contact_access_deals", [column])

    op.create_table(
        "contact_deal_signatures",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("deal_id", sa.Integer(), nullable=False),
        sa.Column("signer_id", sa.Integer(), nullable=False),
        sa.Column("party", deal_party, nullable=False),
        sa.Column("method", signature_method, nullable=False),
        sa.Column("document_hash", sa.String(64), nullable=False),
        sa.Column("signer_name", sa.String(500), nullable=False),
        sa.Column("ip_address", sa.String(64), nullable=True),
        sa.Column("user_agent", sa.String(500), nullable=True),
        sa.Column("session_id_hash", sa.String(64), nullable=True),
        sa.Column("signed_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["deal_id"], ["contact_access_deals.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["signer_id"], ["users.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("deal_id", "party", name="uq_contact_deal_signature_party"),
    )
    op.create_index("ix_contact_deal_signatures_deal_id", "contact_deal_signatures", ["deal_id"])
    op.create_index("ix_contact_deal_signatures_signer_id", "contact_deal_signatures", ["signer_id"])

    op.create_table(
        "contact_payment_receipts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("public_id", sa.String(36), nullable=False),
        sa.Column("deal_id", sa.Integer(), nullable=False),
        sa.Column("uploader_id", sa.Integer(), nullable=False),
        sa.Column("storage_key", sa.String(500), nullable=False),
        sa.Column("original_name", sa.String(255), nullable=False),
        sa.Column("content_type", sa.String(100), nullable=False),
        sa.Column("size_bytes", sa.BigInteger(), nullable=False),
        sa.Column("sha256", sa.String(64), nullable=False),
        sa.Column("status", receipt_status, nullable=False),
        sa.Column("rejection_reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["deal_id"], ["contact_access_deals.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["uploader_id"], ["users.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("public_id"),
        sa.UniqueConstraint("storage_key"),
    )
    for column in ("public_id", "deal_id", "status"):
        op.create_index(f"ix_contact_payment_receipts_{column}", "contact_payment_receipts", [column])


def downgrade() -> None:
    op.drop_table("contact_payment_receipts")
    op.drop_table("contact_deal_signatures")
    op.drop_table("contact_access_deals")
    op.drop_constraint("ck_user_contact_price_positive", "users", type_="check")
    op.drop_column("users", "contact_disclosure_consent_version")
    op.drop_column("users", "contact_disclosure_consent_at")
    op.drop_column("users", "contact_payment_details_encrypted")
    op.drop_column("users", "contact_price_kopecks")
    op.drop_column("users", "contact_sales_enabled")
    for name in (
        "contactreceiptstatus",
        "contactdealreleaseactor",
        "contactsignaturemethod",
        "contactdealparty",
        "contactdealstatus",
    ):
        sa.Enum(name=name).drop(op.get_bind(), checkfirst=True)
