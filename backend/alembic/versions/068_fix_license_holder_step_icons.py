"""Чиним иконки шагов держателя лицензии: были /icons/X.svg (не существуют),
нужны /number_X.svg как у остальных ролей.

Идемпотентна: UPDATE подхватит и старые битые, и любые будущие пересиды.

Revision ID: 068
Revises: 067
"""
from typing import Sequence, Union

from alembic import op


revision: str = "068"
down_revision: Union[str, None] = "067"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE landing_steps
        SET icon = CASE position
            WHEN 1 THEN '/number_1.svg'
            WHEN 2 THEN '/number_2.svg'
            WHEN 3 THEN '/number_3.svg'
            WHEN 4 THEN '/number_4.svg'
            ELSE icon
        END
        WHERE role = 'license_holder'
        """
    )


def downgrade() -> None:
    pass
