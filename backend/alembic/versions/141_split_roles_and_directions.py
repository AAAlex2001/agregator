"""users -> accounts + профили ролей + направления (кадастр, судебная экспертиза)

Revision ID: 141
Revises: 140
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "141"
down_revision: str | None = "140"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

CUSTOMER_TOGGLES = (
    "email_on_response_created",
    "email_on_response_updated",
    "email_on_expert_rejected",
    "email_on_question_asked",
)

EXPERT_TOGGLES = (
    "email_on_order_updated",
    "email_on_bidding_finished",
    "email_on_question_answered",
    "email_on_labor_listing",
)

LICENSE_HOLDER_TOGGLES = (
    "email_on_order_updated",
    "email_on_bidding_finished",
    "email_on_labor_listing",
)

RENAMED_INDEXES = (
    ("users_pkey", "accounts_pkey"),
    ("ix_users_id", "ix_accounts_id"),
    ("ix_users_public_id", "ix_accounts_public_id"),
    ("ix_users_role", "ix_accounts_role"),
    ("ix_users_email", "ix_accounts_email"),
    ("ix_users_phone", "ix_accounts_phone"),
    ("ix_users_inn", "ix_accounts_inn"),
    ("ix_users_telegram_id", "ix_accounts_telegram_id"),
)

RENAMED_CONSTRAINTS = (
    ("uq_users_email_role", "uq_accounts_email_role"),
    ("uq_users_phone_role", "uq_accounts_phone_role"),
    ("user_email_or_phone_required", "account_email_or_phone_required"),
)

DROPPED_ACCOUNT_COLUMNS = (
    *CUSTOMER_TOGGLES,
    *EXPERT_TOGGLES,
    "notify_order_types",
    "rating",
    "review_count",
    "expert_certificates",
    "expert_show_on_map",
    "expert_map_fields",
    "location_lat",
    "location_lng",
    "location_address",
    "location_city",
    "travels_to_other_regions",
    "contact_sales_enabled",
    "contact_price_kopecks",
    "contact_payment_details_encrypted",
    "contact_disclosure_consent_at",
    "contact_disclosure_consent_version",
    "license_number",
    "license_file_url",
    "license_areas",
    "mining_license_number",
    "mining_license_file_url",
    "sro_design_file_url",
    "lab_accreditation_number",
    "lab_accreditation_file_url",
    "company_card_url",
    "license_rental_kind",
    "license_rental_percent",
    "license_rental_fixed_amount",
)

EXPERT_TRANSFER = (
    ("rating", "rating"),
    ("review_count", "review_count"),
    ("certificates", "expert_certificates"),
    ("location_lat", "location_lat"),
    ("location_lng", "location_lng"),
    ("location_address", "location_address"),
    ("location_city", "location_city"),
    ("travels_to_other_regions", "travels_to_other_regions"),
    ("show_on_map", "expert_show_on_map"),
    ("map_fields", "expert_map_fields"),
    ("contact_sales_enabled", "contact_sales_enabled"),
    ("contact_price_kopecks", "contact_price_kopecks"),
    ("contact_payment_details_encrypted", "contact_payment_details_encrypted"),
    ("contact_disclosure_consent_at", "contact_disclosure_consent_at"),
    ("contact_disclosure_consent_version", "contact_disclosure_consent_version"),
    ("notify_order_types", "notify_order_types"),
    *((toggle, toggle) for toggle in EXPERT_TOGGLES),
)

LICENSE_HOLDER_TRANSFER = (
    ("license_number", "license_number"),
    ("license_file_url", "license_file_url"),
    ("license_areas", "license_areas"),
    ("mining_license_number", "mining_license_number"),
    ("mining_license_file_url", "mining_license_file_url"),
    ("sro_design_file_url", "sro_design_file_url"),
    ("lab_accreditation_number", "lab_accreditation_number"),
    ("lab_accreditation_file_url", "lab_accreditation_file_url"),
    ("company_card_url", "company_card_url"),
    ("license_rental_kind", "license_rental_kind"),
    ("license_rental_percent", "license_rental_percent"),
    ("license_rental_fixed_amount", "license_rental_fixed_amount"),
    *((toggle, toggle) for toggle in LICENSE_HOLDER_TOGGLES),
)


def toggle_column(name: str) -> sa.Column:
    return sa.Column(name, sa.Boolean(), nullable=False, server_default="true")


def timestamp_columns() -> tuple[sa.Column, sa.Column]:
    return (
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )


def transfer_sql(table: str, role: str, mapping: tuple[tuple[str, str], ...]) -> str:
    target_columns = ", ".join(target for target, _ in mapping)
    source_columns = ", ".join(source for _, source in mapping)
    return (
        f"INSERT INTO {table} (account_id, {target_columns}, created_at, updated_at) "
        f"SELECT id, {source_columns}, created_at, now() FROM accounts WHERE role = '{role}'"
    )


def restore_sql(alias: str, table: str, mapping: tuple[tuple[str, str], ...]) -> str:
    assignments = ", ".join(f"{source} = {alias}.{target}" for target, source in mapping)
    return f"UPDATE accounts SET {assignments} FROM {table} {alias} WHERE {alias}.account_id = accounts.id"


def upgrade() -> None:
    op.execute("ALTER TYPE orderworktype ADD VALUE IF NOT EXISTS 'CADASTRAL'")
    op.execute("ALTER TYPE orderworktype ADD VALUE IF NOT EXISTS 'FORENSIC'")
    op.execute("CREATE TYPE forensicworkplacekind AS ENUM ('ORGANIZATION', 'INDIVIDUAL')")

    op.rename_table("users", "accounts")
    op.execute("ALTER SEQUENCE IF EXISTS users_id_seq RENAME TO accounts_id_seq")
    for old_name, new_name in RENAMED_INDEXES:
        op.execute(f"ALTER INDEX IF EXISTS {old_name} RENAME TO {new_name}")
    for old_name, new_name in RENAMED_CONSTRAINTS:
        op.execute(f"ALTER TABLE accounts RENAME CONSTRAINT {old_name} TO {new_name}")
    op.execute("ALTER TABLE accounts DROP CONSTRAINT IF EXISTS user_license_rental_kind_valid")
    op.execute("ALTER TABLE accounts DROP CONSTRAINT IF EXISTS ck_user_contact_price_positive")

    op.create_table(
        "customers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("account_id", sa.Integer(), nullable=False),
        *(toggle_column(toggle) for toggle in CUSTOMER_TOGGLES),
        *timestamp_columns(),
        sa.ForeignKeyConstraint(["account_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("account_id", name="uq_customers_account_id"),
    )
    op.create_index("ix_customers_account_id", "customers", ["account_id"])

    op.create_table(
        "experts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("account_id", sa.Integer(), nullable=False),
        sa.Column("rating", sa.Numeric(2, 1), nullable=True),
        sa.Column("review_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("certificates", postgresql.JSONB(), nullable=True),
        sa.Column("location_lat", sa.Float(), nullable=True),
        sa.Column("location_lng", sa.Float(), nullable=True),
        sa.Column("location_address", sa.String(500), nullable=True),
        sa.Column("location_city", sa.String(200), nullable=True),
        sa.Column("travels_to_other_regions", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("show_on_map", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("map_fields", postgresql.JSONB(), nullable=True),
        sa.Column("contact_sales_enabled", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("contact_price_kopecks", sa.BigInteger(), nullable=True),
        sa.Column("contact_payment_details_encrypted", sa.Text(), nullable=True),
        sa.Column("contact_disclosure_consent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("contact_disclosure_consent_version", sa.String(30), nullable=True),
        sa.Column("notify_order_types", postgresql.JSONB(), nullable=True),
        *(toggle_column(toggle) for toggle in EXPERT_TOGGLES),
        *timestamp_columns(),
        sa.ForeignKeyConstraint(["account_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("account_id", name="uq_experts_account_id"),
        sa.CheckConstraint(
            "contact_price_kopecks IS NULL OR contact_price_kopecks > 0",
            name="ck_experts_contact_price_positive",
        ),
    )
    op.create_index("ix_experts_account_id", "experts", ["account_id"])

    op.create_table(
        "license_holders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("account_id", sa.Integer(), nullable=False),
        sa.Column("license_number", sa.String(100), nullable=True),
        sa.Column("license_file_url", sa.String(500), nullable=True),
        sa.Column("license_areas", postgresql.JSONB(), nullable=True),
        sa.Column("mining_license_number", sa.String(100), nullable=True),
        sa.Column("mining_license_file_url", sa.String(500), nullable=True),
        sa.Column("sro_design_file_url", sa.String(500), nullable=True),
        sa.Column("lab_accreditation_number", sa.String(100), nullable=True),
        sa.Column("lab_accreditation_file_url", sa.String(500), nullable=True),
        sa.Column("company_card_url", sa.String(500), nullable=True),
        sa.Column("license_rental_kind", sa.String(20), nullable=True),
        sa.Column("license_rental_percent", sa.Numeric(5, 2), nullable=True),
        sa.Column("license_rental_fixed_amount", sa.BigInteger(), nullable=True),
        *(toggle_column(toggle) for toggle in LICENSE_HOLDER_TOGGLES),
        *timestamp_columns(),
        sa.ForeignKeyConstraint(["account_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("account_id", name="uq_license_holders_account_id"),
        sa.CheckConstraint(
            "license_rental_kind IS NULL OR license_rental_kind IN ('PERCENT', 'FIXED', 'NEGOTIABLE')",
            name="ck_license_holders_rental_kind_valid",
        ),
    )
    op.create_index("ix_license_holders_account_id", "license_holders", ["account_id"])

    op.create_table(
        "expert_cadastral_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("expert_id", sa.Integer(), nullable=False),
        sa.Column("education", sa.Text(), nullable=False, server_default=""),
        sa.Column("registry_joined_at", sa.Date(), nullable=True),
        sa.Column("certificate_number", sa.String(100), nullable=True),
        sa.Column("registry_number", sa.String(100), nullable=True),
        sa.Column("equipment", sa.Text(), nullable=False, server_default=""),
        sa.Column("workplace", sa.String(500), nullable=False, server_default=""),
        sa.Column("documents", postgresql.JSONB(), nullable=False, server_default="[]"),
        *timestamp_columns(),
        sa.ForeignKeyConstraint(["expert_id"], ["experts.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("expert_id", name="uq_expert_cadastral_profiles_expert_id"),
    )
    op.create_index("ix_expert_cadastral_profiles_expert_id", "expert_cadastral_profiles", ["expert_id"])

    op.create_table(
        "expert_forensic_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("expert_id", sa.Integer(), nullable=False),
        sa.Column("education", sa.Text(), nullable=False, server_default=""),
        sa.Column("similar_cases_experience", sa.Text(), nullable=False, server_default=""),
        sa.Column(
            "workplace_kind",
            postgresql.ENUM("ORGANIZATION", "INDIVIDUAL", name="forensicworkplacekind", create_type=False),
            nullable=False,
            server_default="INDIVIDUAL",
        ),
        sa.Column("workplace_name", sa.String(500), nullable=False, server_default=""),
        sa.Column("documents", postgresql.JSONB(), nullable=False, server_default="[]"),
        *timestamp_columns(),
        sa.ForeignKeyConstraint(["expert_id"], ["experts.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("expert_id", name="uq_expert_forensic_profiles_expert_id"),
    )
    op.create_index("ix_expert_forensic_profiles_expert_id", "expert_forensic_profiles", ["expert_id"])

    op.create_table(
        "order_cadastral_details",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), nullable=False),
        sa.Column("work_location", sa.String(500), nullable=False),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("order_id", name="uq_order_cadastral_details_order_id"),
    )
    op.create_index("ix_order_cadastral_details_order_id", "order_cadastral_details", ["order_id"])

    op.create_table(
        "order_forensic_details",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), nullable=False),
        sa.Column("government_body", sa.String(500), nullable=False),
        sa.Column("expert_requirements", sa.Text(), nullable=False),
        sa.Column("subject_location", sa.String(500), nullable=False),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("order_id", name="uq_order_forensic_details_order_id"),
    )
    op.create_index("ix_order_forensic_details_order_id", "order_forensic_details", ["order_id"])

    customer_columns = ", ".join(CUSTOMER_TOGGLES)
    op.execute(
        f"INSERT INTO customers (account_id, {customer_columns}, created_at, updated_at) "
        f"SELECT id, {customer_columns}, created_at, now() FROM accounts WHERE role = 'CUSTOMER'"
    )
    op.execute(transfer_sql("experts", "EXPERT", EXPERT_TRANSFER))
    op.execute(transfer_sql("license_holders", "LICENSE_HOLDER", LICENSE_HOLDER_TRANSFER))

    for column in dict.fromkeys(DROPPED_ACCOUNT_COLUMNS):
        op.drop_column("accounts", column)


def downgrade() -> None:
    for toggle in dict.fromkeys((*CUSTOMER_TOGGLES, *EXPERT_TOGGLES)):
        op.add_column("accounts", toggle_column(toggle))
    op.add_column("accounts", sa.Column("notify_order_types", postgresql.JSONB(), nullable=True))
    op.add_column("accounts", sa.Column("rating", sa.Numeric(2, 1), nullable=True))
    op.add_column("accounts", sa.Column("review_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("accounts", sa.Column("expert_certificates", postgresql.JSONB(), nullable=True))
    op.add_column("accounts", sa.Column("expert_show_on_map", sa.Boolean(), nullable=False, server_default="true"))
    op.add_column("accounts", sa.Column("expert_map_fields", postgresql.JSONB(), nullable=True))
    op.add_column("accounts", sa.Column("location_lat", sa.Float(), nullable=True))
    op.add_column("accounts", sa.Column("location_lng", sa.Float(), nullable=True))
    op.add_column("accounts", sa.Column("location_address", sa.String(500), nullable=True))
    op.add_column("accounts", sa.Column("location_city", sa.String(200), nullable=True))
    op.add_column("accounts", sa.Column("travels_to_other_regions", sa.Boolean(), nullable=False, server_default="false"))
    op.add_column("accounts", sa.Column("contact_sales_enabled", sa.Boolean(), nullable=False, server_default="false"))
    op.add_column("accounts", sa.Column("contact_price_kopecks", sa.BigInteger(), nullable=True))
    op.add_column("accounts", sa.Column("contact_payment_details_encrypted", sa.Text(), nullable=True))
    op.add_column("accounts", sa.Column("contact_disclosure_consent_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("accounts", sa.Column("contact_disclosure_consent_version", sa.String(30), nullable=True))
    op.add_column("accounts", sa.Column("license_number", sa.String(100), nullable=True))
    op.add_column("accounts", sa.Column("license_file_url", sa.String(500), nullable=True))
    op.add_column("accounts", sa.Column("license_areas", postgresql.JSONB(), nullable=True))
    op.add_column("accounts", sa.Column("mining_license_number", sa.String(100), nullable=True))
    op.add_column("accounts", sa.Column("mining_license_file_url", sa.String(500), nullable=True))
    op.add_column("accounts", sa.Column("sro_design_file_url", sa.String(500), nullable=True))
    op.add_column("accounts", sa.Column("lab_accreditation_number", sa.String(100), nullable=True))
    op.add_column("accounts", sa.Column("lab_accreditation_file_url", sa.String(500), nullable=True))
    op.add_column("accounts", sa.Column("company_card_url", sa.String(500), nullable=True))
    op.add_column("accounts", sa.Column("license_rental_kind", sa.String(20), nullable=True))
    op.add_column("accounts", sa.Column("license_rental_percent", sa.Numeric(5, 2), nullable=True))
    op.add_column("accounts", sa.Column("license_rental_fixed_amount", sa.BigInteger(), nullable=True))

    customer_assignments = ", ".join(f"{toggle} = c.{toggle}" for toggle in CUSTOMER_TOGGLES)
    op.execute(f"UPDATE accounts SET {customer_assignments} FROM customers c WHERE c.account_id = accounts.id")
    op.execute(restore_sql("e", "experts", EXPERT_TRANSFER))
    op.execute(restore_sql("h", "license_holders", LICENSE_HOLDER_TRANSFER))

    op.create_check_constraint(
        "user_license_rental_kind_valid",
        "accounts",
        "license_rental_kind IS NULL OR license_rental_kind IN ('PERCENT', 'FIXED', 'NEGOTIABLE')",
    )
    op.create_check_constraint(
        "ck_user_contact_price_positive",
        "accounts",
        "contact_price_kopecks IS NULL OR contact_price_kopecks > 0",
    )

    op.drop_table("order_forensic_details")
    op.drop_table("order_cadastral_details")
    op.drop_table("expert_forensic_profiles")
    op.drop_table("expert_cadastral_profiles")
    op.drop_table("license_holders")
    op.drop_table("experts")
    op.drop_table("customers")
    op.execute("DROP TYPE forensicworkplacekind")

    for old_name, new_name in RENAMED_CONSTRAINTS:
        op.execute(f"ALTER TABLE accounts RENAME CONSTRAINT {new_name} TO {old_name}")
    for old_name, new_name in RENAMED_INDEXES:
        op.execute(f"ALTER INDEX IF EXISTS {new_name} RENAME TO {old_name}")
    op.execute("ALTER SEQUENCE IF EXISTS accounts_id_seq RENAME TO users_id_seq")
    op.rename_table("accounts", "users")
