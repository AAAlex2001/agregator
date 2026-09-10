"""Публичные ответы на вопросы РТН и подписка на официальный ответ.

Revision ID: 173
Revises: 172
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "173"
down_revision: str | None = "172"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "rtn_question_replies",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "question_id",
            sa.Integer(),
            sa.ForeignKey("rtn_questions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("visitor_key", sa.String(length=100), nullable=False),
        sa.Column("text", sa.Text(), nullable=False, server_default=""),
        sa.Column("attachments", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_rtn_question_replies_question_id", "rtn_question_replies", ["question_id"])
    op.create_index("ix_rtn_question_replies_user_id", "rtn_question_replies", ["user_id"])
    op.create_index("ix_rtn_question_replies_visitor_key", "rtn_question_replies", ["visitor_key"])

    op.create_table(
        "rtn_question_subscriptions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "question_id",
            sa.Integer(),
            sa.ForeignKey("rtn_questions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("notified_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("question_id", "email", name="uq_rtn_question_subscription"),
    )
    op.create_index("ix_rtn_question_subscriptions_question_id", "rtn_question_subscriptions", ["question_id"])
    op.create_index("ix_rtn_question_subscriptions_user_id", "rtn_question_subscriptions", ["user_id"])
    op.create_index("ix_rtn_question_subscriptions_email", "rtn_question_subscriptions", ["email"])


def downgrade() -> None:
    op.drop_table("rtn_question_subscriptions")
    op.drop_table("rtn_question_replies")
