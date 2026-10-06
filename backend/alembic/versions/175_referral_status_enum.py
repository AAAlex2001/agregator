"""Статус приглашения — PostgreSQL enum, как у остальных статусов.

Revision ID: 175
Revises: 174
"""

from sqlalchemy.dialects import postgresql

from alembic import op

revision = "175"
down_revision = "174"
branch_labels = None
depends_on = None

STATUS = postgresql.ENUM("PENDING", "REWARDED", "POOL_EXHAUSTED", "REJECTED", name="referralstatus")


def upgrade() -> None:
    """Переводит referrals.status со строки с CHECK на enum."""
    STATUS.create(op.get_bind())
    op.drop_constraint("ck_referral_status", "referrals", type_="check")
    op.execute("ALTER TABLE referrals ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TABLE referrals ALTER COLUMN status TYPE referralstatus USING status::referralstatus")
    op.execute("ALTER TABLE referrals ALTER COLUMN status SET DEFAULT 'PENDING'")


def downgrade() -> None:
    """Возвращает строковый статус с CHECK."""
    op.execute("ALTER TABLE referrals ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TABLE referrals ALTER COLUMN status TYPE VARCHAR(20) USING status::text")
    op.execute("ALTER TABLE referrals ALTER COLUMN status SET DEFAULT 'PENDING'")
    op.create_check_constraint(
        "ck_referral_status",
        "referrals",
        "status IN ('PENDING', 'REWARDED', 'POOL_EXHAUSTED', 'REJECTED')",
    )
    STATUS.drop(op.get_bind())
