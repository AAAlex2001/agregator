"""previous_* поля для отклика и заказа: трекинг изменений с подсветкой diff.

Идемпотентна: использует ADD COLUMN IF NOT EXISTS, чтобы безопасно
дополнить колонки на стейджах, где часть полей уже была накатана из ранней
версии 063.

Revision ID: 064
Revises: 063
"""
from typing import Sequence, Union

from alembic import op


revision: str = "064"
down_revision: Union[str, None] = "063"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE order_responses ADD COLUMN IF NOT EXISTS previous_comment TEXT")
    op.execute("ALTER TABLE order_responses ADD COLUMN IF NOT EXISTS previous_proposed_sum_amount BIGINT")
    op.execute("ALTER TABLE order_responses ADD COLUMN IF NOT EXISTS previous_proposed_deadline DATE")
    op.execute("ALTER TABLE order_responses ADD COLUMN IF NOT EXISTS previous_vat_kind vatkind")
    op.execute("ALTER TABLE order_responses ADD COLUMN IF NOT EXISTS previous_technical_files JSON")

    op.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS previous_title VARCHAR(500)")
    op.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS previous_comment TEXT")
    op.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS previous_sum_amount BIGINT")
    op.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS previous_deadline DATE")
    op.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS previous_technical_files JSON")
    op.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS previous_badges JSON")


def downgrade() -> None:
    op.execute("ALTER TABLE orders DROP COLUMN IF EXISTS previous_badges")
    op.execute("ALTER TABLE orders DROP COLUMN IF EXISTS previous_technical_files")
    op.execute("ALTER TABLE orders DROP COLUMN IF EXISTS previous_deadline")
    op.execute("ALTER TABLE orders DROP COLUMN IF EXISTS previous_sum_amount")
    op.execute("ALTER TABLE orders DROP COLUMN IF EXISTS previous_comment")
    op.execute("ALTER TABLE orders DROP COLUMN IF EXISTS previous_title")
    op.execute("ALTER TABLE order_responses DROP COLUMN IF EXISTS previous_technical_files")
    op.execute("ALTER TABLE order_responses DROP COLUMN IF EXISTS previous_vat_kind")
    op.execute("ALTER TABLE order_responses DROP COLUMN IF EXISTS previous_proposed_deadline")
    op.execute("ALTER TABLE order_responses DROP COLUMN IF EXISTS previous_proposed_sum_amount")
    op.execute("ALTER TABLE order_responses DROP COLUMN IF EXISTS previous_comment")
