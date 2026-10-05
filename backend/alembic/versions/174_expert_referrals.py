"""Реферальная программа и бонусный счёт исполнителя.

Revision ID: 174
Revises: 173
"""

import sqlalchemy as sa

from alembic import op

revision = "174"
down_revision = "173"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Создаёт фонд, приглашения, бонусные счета и историю начислений."""
    op.create_table(
        "referral_campaigns",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("total_kopecks", sa.BigInteger(), nullable=False),
        sa.Column("reward_kopecks", sa.BigInteger(), nullable=False),
        sa.Column("spent_kopecks", sa.BigInteger(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.CheckConstraint("total_kopecks >= 0", name="ck_referral_total_nonnegative"),
        sa.CheckConstraint("reward_kopecks > 0", name="ck_referral_reward_positive"),
        sa.CheckConstraint(
            "spent_kopecks >= 0 AND spent_kopecks <= total_kopecks",
            name="ck_referral_spent_within_pool",
        ),
    )
    campaign = sa.table(
        "referral_campaigns",
        sa.column("id", sa.Integer()),
        sa.column("total_kopecks", sa.BigInteger()),
        sa.column("reward_kopecks", sa.BigInteger()),
    )
    op.bulk_insert(campaign, [{"id": 1, "total_kopecks": 100_000_000, "reward_kopecks": 300_000}])

    op.create_table(
        "referrals",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("inviter_id", sa.Integer(), sa.ForeignKey("accounts.id", ondelete="SET NULL")),
        sa.Column("invited_id", sa.Integer(), sa.ForeignKey("accounts.id", ondelete="SET NULL"), unique=True),
        sa.Column("invited_email", sa.String(320), nullable=False, unique=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="PENDING"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("rewarded_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint("inviter_id <> invited_id", name="ck_referral_not_self"),
        sa.CheckConstraint(
            "status IN ('PENDING', 'REWARDED', 'POOL_EXHAUSTED', 'REJECTED')",
            name="ck_referral_status",
        ),
    )
    op.create_index("ix_referrals_inviter_id", "referrals", ["inviter_id"])

    op.create_table(
        "bonus_accounts",
        sa.Column(
            "user_id", sa.Integer(), sa.ForeignKey("accounts.id", ondelete="RESTRICT"), primary_key=True
        ),
        sa.Column("balance_kopecks", sa.BigInteger(), nullable=False, server_default="0"),
        sa.CheckConstraint("balance_kopecks >= 0", name="ck_bonus_balance_nonnegative"),
    )
    op.create_table(
        "bonus_transactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("bonus_accounts.user_id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column(
            "referral_id",
            sa.Integer(),
            sa.ForeignKey("referrals.id", ondelete="RESTRICT"),
            nullable=False,
            unique=True,
        ),
        sa.Column("amount_kopecks", sa.BigInteger(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("amount_kopecks > 0", name="ck_bonus_amount_positive"),
    )
    op.create_index("ix_bonus_transactions_user_id", "bonus_transactions", ["user_id"])


def downgrade() -> None:
    """Удаляет данные программы при явном откате миграции."""
    op.drop_table("bonus_transactions")
    op.drop_table("bonus_accounts")
    op.drop_table("referrals")
    op.drop_table("referral_campaigns")
