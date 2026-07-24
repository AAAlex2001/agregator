"""rtn clarifications: catalog, taxonomy, discussion, feedback

Revision ID: 142
Revises: 141
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "142"
down_revision: str | None = "141"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

DOCUMENT_TYPE = postgresql.ENUM(
    "OFFICIAL_CLARIFICATION", "INFO_LETTER", "RESPONSE_TO_REQUEST", name="rtn_document_type"
)
CLARIFICATION_STATUS = postgresql.ENUM("ACTIVE", "EXPIRED", name="rtn_clarification_status")
PUBLICATION_STATUS = postgresql.ENUM("DRAFT", "PUBLISHED", name="rtn_publication_status")
OVERSIGHT_AREA = postgresql.ENUM(
    "INDUSTRIAL_SAFETY", "HYDRO_SAFETY", "NUCLEAR", "ENERGY", "MINING", "CONSTRUCTION", "SRO", "LICENSING",
    name="rtn_oversight_area",
)
INDUSTRY = postgresql.ENUM(
    "COAL", "MINING_UNDERGROUND", "OIL_GAS_EXTRACTION", "OIL_REFINING", "PIPELINE_GAS_STORAGE",
    "GAS_DISTRIBUTION", "METALLURGY", "CHEMICAL", "DEFENSE", "HAZMAT_TRANSPORT", "PLANT_MATERIAL_STORAGE",
    "EXPLOSIVES", "PRESSURE_EQUIPMENT", "LIFTING_MECHANISMS", "SURVEYING_SUBSOIL", "HAZARD_LIFTS",
    "POWER_PLANTS", "HYDRO_STRUCTURES", "CONSTRUCTION_OBJECTS", "SRO_CONSTRUCTION", "SRO_ENERGY_AUDIT",
    name="rtn_industry",
)
ACTIVITY = postgresql.ENUM(
    "LICENSING", "EXPERT", "OPO_REGISTRY", "DECLARATIONS", "ATTESTATION_INDUSTRIAL", "ATTESTATION_HYDRO",
    "ATTESTATION_COMBINED", name="rtn_activity",
)
OBJECT_TYPE = postgresql.ENUM(
    "GAS_NETWORKS", "LIFTING_STRUCTURES", "PRESSURE_EQUIPMENT", "POWER_OBJECTS", "SUPPORT_STRUCTURES",
    "SAFETY_SYSTEMS", "TECHNICAL_DEVICES", name="rtn_object_type",
)
COMMENT_REACTION_VALUE = postgresql.ENUM("USEFUL", "CLARIFICATION", "AGREE", name="rtn_comment_reaction_value")
QUESTION_STATUS = postgresql.ENUM("NEW", "PUBLISHED", "DISMISSED", name="rtn_question_status")
CHANGE_REPORT_STATUS = postgresql.ENUM("NEW", "REVIEWED", "APPLIED", name="rtn_change_report_status")

TAXONOMY_ENUMS = (
    DOCUMENT_TYPE, CLARIFICATION_STATUS, PUBLICATION_STATUS, OVERSIGHT_AREA, INDUSTRY, ACTIVITY, OBJECT_TYPE,
    COMMENT_REACTION_VALUE, QUESTION_STATUS, CHANGE_REPORT_STATUS,
)


def upgrade() -> None:
    # Каждый ENUM ниже используется ровно в одной таблице — SQLAlchemy создаст тип автоматически
    # перед созданием этой таблицы (событие before_create). Явный enum.create() здесь не нужен:
    # он бы создал тип заранее, а автособытие тут же попыталось бы создать его повторно
    # с checkfirst=False и упало на "type already exists".
    op.create_table(
        "rtn_clarifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("document_type", DOCUMENT_TYPE, nullable=False),
        sa.Column("status", CLARIFICATION_STATUS, nullable=False, server_default="ACTIVE"),
        sa.Column("publication_status", PUBLICATION_STATUS, nullable=False, server_default="DRAFT"),
        sa.Column("slug", sa.String(220), nullable=False, unique=True),
        sa.Column("title", sa.String(300), nullable=False, server_default=""),
        sa.Column("excerpt", sa.Text(), nullable=False, server_default=""),
        sa.Column("question_text", sa.Text(), nullable=False, server_default=""),
        sa.Column("answer_html", sa.Text(), nullable=False, server_default=""),
        sa.Column("letter_number", sa.String(100), nullable=False, server_default=""),
        sa.Column("department", sa.String(300), nullable=False, server_default=""),
        sa.Column("source_url", sa.String(500), nullable=False, server_default=""),
        sa.Column("pdf_url", sa.String(500), nullable=False, server_default=""),
        sa.Column("referenced_regulations", postgresql.JSON(), nullable=False, server_default="[]"),
        sa.Column("meta_title", sa.String(300), nullable=False, server_default=""),
        sa.Column("meta_description", sa.Text(), nullable=False, server_default=""),
        sa.Column("meta_keywords", sa.Text(), nullable=False, server_default=""),
        sa.Column("views_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_rtn_clarifications_document_type", "rtn_clarifications", ["document_type"])
    op.create_index("ix_rtn_clarifications_status", "rtn_clarifications", ["status"])
    op.create_index("ix_rtn_clarifications_publication_status", "rtn_clarifications", ["publication_status"])
    op.create_index("ix_rtn_clarifications_slug", "rtn_clarifications", ["slug"], unique=True)
    op.create_index("ix_rtn_clarifications_published_at", "rtn_clarifications", ["published_at"])
    op.create_index(
        "ix_rtn_clarifications_pubstatus_published", "rtn_clarifications", ["publication_status", "published_at"]
    )

    op.create_table(
        "rtn_clarification_tags",
        sa.Column("clarification_id", sa.Integer(), sa.ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("tag_id", sa.Integer(), sa.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
    )
    op.create_table(
        "rtn_clarification_oversight_areas",
        sa.Column("clarification_id", sa.Integer(), sa.ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("area", OVERSIGHT_AREA, primary_key=True),
    )
    op.create_table(
        "rtn_clarification_industries",
        sa.Column("clarification_id", sa.Integer(), sa.ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("industry", INDUSTRY, primary_key=True),
    )
    op.create_table(
        "rtn_clarification_activities",
        sa.Column("clarification_id", sa.Integer(), sa.ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("activity", ACTIVITY, primary_key=True),
    )
    op.create_table(
        "rtn_clarification_object_types",
        sa.Column("clarification_id", sa.Integer(), sa.ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("object_type", OBJECT_TYPE, primary_key=True),
    )

    op.create_table(
        "rtn_comments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("clarification_id", sa.Integer(), sa.ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=True),
        sa.Column("visitor_key", sa.String(100), nullable=False),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("rtn_comments.id", ondelete="CASCADE"), nullable=True),
        sa.Column("text", sa.Text(), nullable=False, server_default=""),
        sa.Column("attachments", postgresql.JSON(), nullable=False, server_default="[]"),
        sa.Column("useful_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("clarification_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("agree_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_rtn_comments_clarification_id", "rtn_comments", ["clarification_id"])
    op.create_index("ix_rtn_comments_user_id", "rtn_comments", ["user_id"])
    op.create_index("ix_rtn_comments_visitor_key", "rtn_comments", ["visitor_key"])
    op.create_index("ix_rtn_comments_parent_id", "rtn_comments", ["parent_id"])

    op.create_table(
        "rtn_comment_reactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("comment_id", sa.Integer(), sa.ForeignKey("rtn_comments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=True),
        sa.Column("visitor_key", sa.String(100), nullable=False),
        sa.Column("value", COMMENT_REACTION_VALUE, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("comment_id", "visitor_key", name="uq_rtn_comment_reaction_identity"),
    )
    op.create_index("ix_rtn_comment_reactions_comment_id", "rtn_comment_reactions", ["comment_id"])
    op.create_index("ix_rtn_comment_reactions_user_id", "rtn_comment_reactions", ["user_id"])

    op.create_table(
        "rtn_questions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("visitor_key", sa.String(100), nullable=False),
        sa.Column("contact_email", sa.String(255), nullable=False, server_default=""),
        sa.Column("question_text", sa.Text(), nullable=False, server_default=""),
        sa.Column("status", QUESTION_STATUS, nullable=False, server_default="NEW"),
        sa.Column("answered_clarification_id", sa.Integer(), sa.ForeignKey("rtn_clarifications.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_rtn_questions_user_id", "rtn_questions", ["user_id"])
    op.create_index("ix_rtn_questions_visitor_key", "rtn_questions", ["visitor_key"])
    op.create_index("ix_rtn_questions_status", "rtn_questions", ["status"])

    op.create_table(
        "rtn_change_reports",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("clarification_id", sa.Integer(), sa.ForeignKey("rtn_clarifications.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("visitor_key", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("status", CHANGE_REPORT_STATUS, nullable=False, server_default="NEW"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_rtn_change_reports_clarification_id", "rtn_change_reports", ["clarification_id"])
    op.create_index("ix_rtn_change_reports_user_id", "rtn_change_reports", ["user_id"])
    op.create_index("ix_rtn_change_reports_status", "rtn_change_reports", ["status"])


def downgrade() -> None:
    op.drop_table("rtn_change_reports")
    op.drop_table("rtn_questions")
    op.drop_table("rtn_comment_reactions")
    op.drop_table("rtn_comments")
    op.drop_table("rtn_clarification_object_types")
    op.drop_table("rtn_clarification_activities")
    op.drop_table("rtn_clarification_industries")
    op.drop_table("rtn_clarification_oversight_areas")
    op.drop_table("rtn_clarification_tags")
    op.drop_table("rtn_clarifications")

    bind = op.get_bind()
    for enum in reversed(TAXONOMY_ENUMS):
        enum.drop(bind, checkfirst=True)
