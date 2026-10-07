"""Бонусы рефералки — внутренние «плюсы» вместо копеек: 1 плюс = 100 бывших копеек.

Revision ID: 176
Revises: 175
"""

from alembic import op

revision = "176"
down_revision = "175"
branch_labels = None
depends_on = None

COLUMNS = {
    "referral_campaigns": ["total", "reward", "spent"],
    "bonus_accounts": ["balance"],
    "bonus_transactions": ["amount"],
}


def upgrade() -> None:
    """Переименовывает *_kopecks в *_points и переводит суммы в целые плюсы."""
    for table, names in COLUMNS.items():
        for name in names:
            op.alter_column(table, f"{name}_kopecks", new_column_name=f"{name}_points")
        assignments = ", ".join(f"{name}_points = {name}_points / 100" for name in names)
        op.execute(f"UPDATE {table} SET {assignments}")


def downgrade() -> None:
    """Возвращает суммы в копейках."""
    for table, names in COLUMNS.items():
        assignments = ", ".join(f"{name}_points = {name}_points * 100" for name in names)
        op.execute(f"UPDATE {table} SET {assignments}")
        for name in names:
            op.alter_column(table, f"{name}_points", new_column_name=f"{name}_kopecks")
