"""add PENDING value to subscriptionstatus and fix legacy active rows

Revision ID: 046
Revises: 045
"""
from typing import Sequence, Union

from alembic import op


revision: str = "046"
down_revision: Union[str, None] = "045"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute(
            "ALTER TYPE subscriptionstatus ADD VALUE IF NOT EXISTS 'PENDING' BEFORE 'ACTIVE'"
        )

    op.execute(
        """
        UPDATE user_subscriptions AS us
        SET status = 'PENDING'
        FROM payments AS p
        WHERE us.payment_id = p.id
          AND us.status = 'ACTIVE'
          AND p.status <> 'SUCCEEDED'
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE user_subscriptions
        SET status = 'EXPIRED'
        WHERE status = 'PENDING'
        """
    )
