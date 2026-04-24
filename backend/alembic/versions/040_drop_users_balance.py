"""drop users.balance column

Revision ID: 040
Revises: 039

Баланс заменён подписками — колонка users.balance больше не используется.
Пополнения/выводы удалены из API, деньги обрабатываются напрямую через YooKassa
под конкретный тариф.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "040"
down_revision: Union[str, None] = "039"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("users", "balance")


def downgrade() -> None:
    op.add_column(
        "users",
        sa.Column("balance", sa.BigInteger(), nullable=False, server_default="0"),
    )
