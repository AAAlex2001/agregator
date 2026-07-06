"""users: telegram_id без unique — одна привязка на все роли одного email

Revision ID: 129
Revises: 128
"""
from collections.abc import Sequence

from alembic import op

revision: str = "129"
down_revision: str | None = "128"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_constraint("uq_users_telegram_id", "users", type_="unique")
    op.execute(
        """
        UPDATE users AS u
        SET telegram_id = linked.telegram_id
        FROM users AS linked
        WHERE linked.telegram_id IS NOT NULL
          AND u.telegram_id IS NULL
          AND u.email IS NOT NULL
          AND u.email = linked.email
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE users SET telegram_id = NULL
        WHERE id NOT IN (
            SELECT MIN(id) FROM users WHERE telegram_id IS NOT NULL GROUP BY telegram_id
        )
        AND telegram_id IS NOT NULL
        """
    )
    op.create_unique_constraint("uq_users_telegram_id", "users", ["telegram_id"])
