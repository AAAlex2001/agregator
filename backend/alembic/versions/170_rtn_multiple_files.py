"""Несколько файлов запросов и ответов в рубрике Ростехнадзора.

Revision ID: 170
Revises: 169
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "170"
down_revision: str | None = "169"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "rtn_clarifications",
        sa.Column("request_files", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
    )
    op.add_column(
        "rtn_clarifications",
        sa.Column("response_files", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
    )
    op.execute(
        """
        UPDATE rtn_clarifications
        SET request_files = json_build_array(
            json_build_object('name', 'Обращение в ведомство.pdf', 'url', pdf_url)
        )
        WHERE pdf_url <> ''
        """
    )
    op.execute(
        """
        UPDATE rtn_clarifications
        SET response_files = json_build_array(
            json_build_object('name', 'Официальный ответ.pdf', 'url', response_pdf_url)
        )
        WHERE response_pdf_url <> ''
        """
    )


def downgrade() -> None:
    op.drop_column("rtn_clarifications", "response_files")
    op.drop_column("rtn_clarifications", "request_files")
