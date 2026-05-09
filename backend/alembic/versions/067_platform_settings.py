"""Глобальные настройки платформы (синглтон): тумблер «платный режим откликов».

Идемпотентна: CREATE TABLE IF NOT EXISTS, ON CONFLICT DO NOTHING для seed.

Revision ID: 067
Revises: 066
"""
from typing import Sequence, Union

from alembic import op


revision: str = "067"
down_revision: Union[str, None] = "066"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS platform_settings (
            id INTEGER PRIMARY KEY,
            paid_responses_enabled BOOLEAN NOT NULL DEFAULT TRUE
        )
        """
    )
    op.execute(
        """
        INSERT INTO platform_settings (id, paid_responses_enabled)
        VALUES (1, TRUE)
        ON CONFLICT (id) DO NOTHING
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS platform_settings")
