"""add bullets list to landing_hero

Revision ID: 083
Revises: 082
"""
import json
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "083"
down_revision: Union[str, None] = "082"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


HERO_BULLETS_DEFAULT = [
    "Проектирование, обоснование безопасности, изыскания на ОПО",
    "Строительство, эксплуатация, реконструкция, капитальный ремонт ОПО",
    "Техническое перевооружение, консервация и ликвидация ОПО",
    "Изготовление, монтаж, наладка, обслуживание и ремонт оборудования (технических устройств)",
    "Экспертиза промышленной безопасности проектной документации, зданий и сооружений, технических устройств",
    "Аудит СУПБ",
]


def upgrade() -> None:
    op.add_column(
        "landing_hero",
        sa.Column(
            "bullets",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
    )
    bullets_json = json.dumps(HERO_BULLETS_DEFAULT, ensure_ascii=False)
    op.execute(
        sa.text(
            "UPDATE landing_hero SET bullets = CAST(:bullets AS JSONB) "
            "WHERE id = 1 AND (bullets IS NULL OR bullets = '[]'::jsonb)"
        ).bindparams(bullets=bullets_json)
    )


def downgrade() -> None:
    op.drop_column("landing_hero", "bullets")
