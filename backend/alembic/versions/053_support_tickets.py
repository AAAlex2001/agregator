"""support tickets

Revision ID: 053
Revises: 052
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect
from sqlalchemy.dialects import postgresql


revision: str = "053"
down_revision: Union[str, None] = "052"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TICKET_STATUS_VALUES = ("REVIEW", "ANSWERED", "CLOSED")
TICKET_CATEGORY_VALUES = (
    "ORDER",
    "RESPONSE",
    "TECHNICAL",
    "BILLING",
    "ACCOUNT",
    "COMPLAINT",
    "SUGGESTION",
    "OTHER",
)
TICKET_AUTHOR_VALUES = ("USER", "ADMIN")


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    postgresql.ENUM(*TICKET_STATUS_VALUES, name="ticketstatus").create(bind, checkfirst=True)
    postgresql.ENUM(*TICKET_CATEGORY_VALUES, name="ticketcategory").create(bind, checkfirst=True)
    postgresql.ENUM(*TICKET_AUTHOR_VALUES, name="ticketmessageauthor").create(bind, checkfirst=True)

    ticket_status_col = postgresql.ENUM(
        *TICKET_STATUS_VALUES, name="ticketstatus", create_type=False
    )
    ticket_category_col = postgresql.ENUM(
        *TICKET_CATEGORY_VALUES, name="ticketcategory", create_type=False
    )
    ticket_author_col = postgresql.ENUM(
        *TICKET_AUTHOR_VALUES, name="ticketmessageauthor", create_type=False
    )

    if not inspector.has_table("support_tickets"):
        op.create_table(
            "support_tickets",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("number", sa.String(length=20), nullable=False),
            sa.Column(
                "user_id",
                sa.Integer(),
                sa.ForeignKey("users.id", ondelete="CASCADE"),
                nullable=False,
            ),
            sa.Column("subject", sa.String(length=200), nullable=False),
            sa.Column("category", ticket_category_col, nullable=False),
            sa.Column("status", ticket_status_col, nullable=False, server_default="REVIEW"),
            sa.Column(
                "has_unread_for_user",
                sa.Boolean(),
                nullable=False,
                server_default=sa.text("false"),
            ),
            sa.Column(
                "has_unread_for_admin",
                sa.Boolean(),
                nullable=False,
                server_default=sa.text("true"),
            ),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.text("now()"),
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.text("now()"),
            ),
        )
        op.create_index("ix_support_tickets_id", "support_tickets", ["id"])
        op.create_index("ix_support_tickets_number", "support_tickets", ["number"], unique=True)
        op.create_index("ix_support_tickets_user_id", "support_tickets", ["user_id"])
        op.create_index("ix_support_tickets_status", "support_tickets", ["status"])
        op.create_index("ix_support_tickets_category", "support_tickets", ["category"])

    if not inspector.has_table("support_ticket_messages"):
        op.create_table(
            "support_ticket_messages",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column(
                "ticket_id",
                sa.Integer(),
                sa.ForeignKey("support_tickets.id", ondelete="CASCADE"),
                nullable=False,
            ),
            sa.Column("author_kind", ticket_author_col, nullable=False),
            sa.Column(
                "author_user_id",
                sa.Integer(),
                sa.ForeignKey("users.id", ondelete="SET NULL"),
                nullable=True,
            ),
            sa.Column("author_name", sa.String(length=200), nullable=False, server_default=""),
            sa.Column("text", sa.Text(), nullable=False, server_default=""),
            sa.Column(
                "attachments",
                sa.JSON(),
                nullable=False,
                server_default=sa.text("'[]'::json"),
            ),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.text("now()"),
            ),
        )
        op.create_index("ix_support_ticket_messages_id", "support_ticket_messages", ["id"])
        op.create_index(
            "ix_support_ticket_messages_ticket_id",
            "support_ticket_messages",
            ["ticket_id"],
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if inspector.has_table("support_ticket_messages"):
        op.drop_index(
            "ix_support_ticket_messages_ticket_id",
            table_name="support_ticket_messages",
        )
        op.drop_index("ix_support_ticket_messages_id", table_name="support_ticket_messages")
        op.drop_table("support_ticket_messages")

    if inspector.has_table("support_tickets"):
        op.drop_index("ix_support_tickets_category", table_name="support_tickets")
        op.drop_index("ix_support_tickets_status", table_name="support_tickets")
        op.drop_index("ix_support_tickets_user_id", table_name="support_tickets")
        op.drop_index("ix_support_tickets_number", table_name="support_tickets")
        op.drop_index("ix_support_tickets_id", table_name="support_tickets")
        op.drop_table("support_tickets")

    postgresql.ENUM(name="ticketmessageauthor").drop(bind, checkfirst=True)
    postgresql.ENUM(name="ticketcategory").drop(bind, checkfirst=True)
    postgresql.ENUM(name="ticketstatus").drop(bind, checkfirst=True)
