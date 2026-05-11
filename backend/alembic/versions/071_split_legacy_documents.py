"""Разнесение исторических `technical_files` (где могло быть до 6 файлов) по корзинам:
первый файл остаётся в technical_files (ТЗ), остальные переезжают в other_files.
То же для previous_*.

Идемпотентна: повторный запуск ничего не меняет (technical_files уже ≤ 1).

Revision ID: 071
Revises: 070
"""
from typing import Sequence, Union

from alembic import op


revision: str = "071"
down_revision: Union[str, None] = "070"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


SPLIT_CURRENT = """
UPDATE orders SET
    technical_files = CASE
        WHEN jsonb_array_length(COALESCE(technical_files::jsonb, '[]'::jsonb)) > 0
            THEN jsonb_build_array(technical_files::jsonb -> 0)
        ELSE '[]'::jsonb
    END,
    other_files = COALESCE(other_files::jsonb, '[]'::jsonb) || COALESCE(
        (
            SELECT jsonb_agg(value)
            FROM jsonb_array_elements(technical_files::jsonb) WITH ORDINALITY AS t(value, ord)
            WHERE t.ord > 1
        ),
        '[]'::jsonb
    )
WHERE jsonb_array_length(COALESCE(technical_files::jsonb, '[]'::jsonb)) > 1;
"""

SPLIT_PREVIOUS = """
UPDATE orders SET
    previous_technical_files = CASE
        WHEN jsonb_array_length(COALESCE(previous_technical_files::jsonb, '[]'::jsonb)) > 0
            THEN jsonb_build_array(previous_technical_files::jsonb -> 0)
        ELSE '[]'::jsonb
    END,
    previous_other_files = COALESCE(previous_other_files::jsonb, '[]'::jsonb) || COALESCE(
        (
            SELECT jsonb_agg(value)
            FROM jsonb_array_elements(previous_technical_files::jsonb) WITH ORDINALITY AS t(value, ord)
            WHERE t.ord > 1
        ),
        '[]'::jsonb
    )
WHERE previous_technical_files IS NOT NULL
  AND jsonb_array_length(previous_technical_files::jsonb) > 1;
"""


def upgrade() -> None:
    op.execute(SPLIT_CURRENT)
    op.execute(SPLIT_PREVIOUS)


def downgrade() -> None:
    # Обратная операция: склеиваем technical_files + other_files обратно в technical_files,
    # other_files обнуляем.
    op.execute(
        """
        UPDATE orders SET
            technical_files = COALESCE(technical_files::jsonb, '[]'::jsonb)
                              || COALESCE(other_files::jsonb, '[]'::jsonb),
            other_files = '[]'::jsonb;
        """
    )
    op.execute(
        """
        UPDATE orders SET
            previous_technical_files = CASE
                WHEN previous_technical_files IS NULL AND previous_other_files IS NULL THEN NULL
                ELSE COALESCE(previous_technical_files::jsonb, '[]'::jsonb)
                     || COALESCE(previous_other_files::jsonb, '[]'::jsonb)
            END,
            previous_other_files = NULL;
        """
    )
