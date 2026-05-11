"""Добавить колонки contract_files, company_files, other_files
(и их previous_* аналоги) для категоризации документов заказа.
Старые `technical_files` уже трактуются как «Техническое задание»,
поэтому перенос данных не требуется.

Revision ID: 070
Revises: 069
"""
from typing import Sequence, Union

from alembic import op


revision: str = "070"
down_revision: Union[str, None] = "069"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_NOT_NULL = ("contract_files", "company_files", "other_files")
NEW_NULLABLE = ("previous_contract_files", "previous_company_files", "previous_other_files")


def upgrade() -> None:
    for column in NEW_NOT_NULL:
        op.execute(
            f"ALTER TABLE orders ADD COLUMN IF NOT EXISTS {column} JSON NOT NULL DEFAULT '[]'::json"
        )
    for column in NEW_NULLABLE:
        op.execute(f"ALTER TABLE orders ADD COLUMN IF NOT EXISTS {column} JSON")


def downgrade() -> None:
    for column in (*NEW_NOT_NULL, *NEW_NULLABLE):
        op.execute(f"ALTER TABLE orders DROP COLUMN IF EXISTS {column}")
