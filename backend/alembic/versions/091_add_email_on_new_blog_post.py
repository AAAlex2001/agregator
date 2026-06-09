"""add email_on_new_blog_post flag to users

Revision ID: 091
Revises: 090
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "091"
down_revision: Union[str, None] = "090"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "email_on_new_blog_post",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "email_on_new_blog_post")
