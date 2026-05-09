"""previous_* поля для отклика и заказа: трекинг изменений с подсветкой diff

Revision ID: 064
Revises: 063
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "064"
down_revision: Union[str, None] = "063"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "order_responses",
        sa.Column("previous_comment", sa.Text(), nullable=True),
    )
    op.add_column(
        "order_responses",
        sa.Column("previous_proposed_sum_amount", sa.BigInteger(), nullable=True),
    )
    op.add_column(
        "order_responses",
        sa.Column("previous_proposed_deadline", sa.Date(), nullable=True),
    )
    op.add_column(
        "order_responses",
        sa.Column(
            "previous_vat_kind",
            sa.Enum("NONE", "VAT_5", "VAT_7", "VAT_22", name="vatkind", create_type=False),
            nullable=True,
        ),
    )
    op.add_column(
        "order_responses",
        sa.Column("previous_technical_files", sa.JSON(), nullable=True),
    )

    op.add_column("orders", sa.Column("previous_title", sa.String(length=500), nullable=True))
    op.add_column("orders", sa.Column("previous_comment", sa.Text(), nullable=True))
    op.add_column("orders", sa.Column("previous_sum_amount", sa.BigInteger(), nullable=True))
    op.add_column("orders", sa.Column("previous_deadline", sa.Date(), nullable=True))
    op.add_column("orders", sa.Column("previous_technical_files", sa.JSON(), nullable=True))
    op.add_column("orders", sa.Column("previous_badges", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("orders", "previous_badges")
    op.drop_column("orders", "previous_technical_files")
    op.drop_column("orders", "previous_deadline")
    op.drop_column("orders", "previous_sum_amount")
    op.drop_column("orders", "previous_comment")
    op.drop_column("orders", "previous_title")
    op.drop_column("order_responses", "previous_technical_files")
    op.drop_column("order_responses", "previous_vat_kind")
    op.drop_column("order_responses", "previous_proposed_deadline")
    op.drop_column("order_responses", "previous_proposed_sum_amount")
    op.drop_column("order_responses", "previous_comment")
