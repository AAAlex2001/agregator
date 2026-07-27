"""add RTN and static news interactions

Revision ID: 144
Revises: 143
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "144"
down_revision: str | None = "143"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "rtn_clarifications",
        sa.Column("likes_count", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "rtn_clarifications",
        sa.Column("dislikes_count", sa.Integer(), nullable=False, server_default="0"),
    )

    op.create_table(
        "rtn_clarification_reactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "clarification_id",
            sa.Integer(),
            sa.ForeignKey("rtn_clarifications.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("visitor_key", sa.String(100), nullable=False),
        sa.Column("value", sa.String(10), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(
        "uq_rtn_clarification_reaction_identity",
        "rtn_clarification_reactions",
        ["clarification_id", "visitor_key"],
        unique=True,
    )
    op.create_index(
        "ix_rtn_clarification_reactions_clarification_id",
        "rtn_clarification_reactions",
        ["clarification_id"],
    )

    op.create_table(
        "rtn_clarification_views",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "clarification_id",
            sa.Integer(),
            sa.ForeignKey("rtn_clarifications.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("visitor_key", sa.String(100), nullable=False),
        sa.Column("viewed_on", sa.Date(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(
        "uq_rtn_clarification_view_daily",
        "rtn_clarification_views",
        ["clarification_id", "visitor_key", "viewed_on"],
        unique=True,
    )
    op.create_index(
        "ix_rtn_clarification_views_clarification_id",
        "rtn_clarification_views",
        ["clarification_id"],
    )

    op.create_table(
        "static_news_metrics",
        sa.Column("news_id", sa.Integer(), primary_key=True),
        sa.Column("likes_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("dislikes_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("views_count", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_table(
        "static_news_reactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "news_id",
            sa.Integer(),
            sa.ForeignKey("static_news_metrics.news_id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("visitor_key", sa.String(100), nullable=False),
        sa.Column("value", sa.String(10), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(
        "uq_static_news_reaction_identity",
        "static_news_reactions",
        ["news_id", "visitor_key"],
        unique=True,
    )
    op.create_index(
        "ix_static_news_reactions_news_id",
        "static_news_reactions",
        ["news_id"],
    )
    op.create_table(
        "static_news_views",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "news_id",
            sa.Integer(),
            sa.ForeignKey("static_news_metrics.news_id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("visitor_key", sa.String(100), nullable=False),
        sa.Column("viewed_on", sa.Date(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(
        "uq_static_news_view_daily",
        "static_news_views",
        ["news_id", "visitor_key", "viewed_on"],
        unique=True,
    )
    op.create_index("ix_static_news_views_news_id", "static_news_views", ["news_id"])


def downgrade() -> None:
    op.drop_table("static_news_views")
    op.drop_table("static_news_reactions")
    op.drop_table("static_news_metrics")
    op.drop_table("rtn_clarification_views")
    op.drop_table("rtn_clarification_reactions")
    op.drop_column("rtn_clarifications", "dislikes_count")
    op.drop_column("rtn_clarifications", "likes_count")
