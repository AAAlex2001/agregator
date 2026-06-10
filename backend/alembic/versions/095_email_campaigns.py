"""email campaigns: campaigns, recipients, suppression

Revision ID: 095
Revises: 094
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "095"
down_revision: Union[str, None] = "094"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    campaign_status = sa.Enum(
        "DRAFT", "RUNNING", "PAUSED", "DONE", "FAILED", name="campaignstatus"
    )
    recipient_status = sa.Enum(
        "PENDING", "SENT", "FAILED", "BOUNCED", "UNSUBSCRIBED", name="recipientstatus"
    )
    suppression_reason = sa.Enum(
        "UNSUBSCRIBE", "BOUNCE", "COMPLAINT", "MANUAL", name="suppressionreason"
    )

    op.create_table(
        "email_campaigns",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("subject", sa.String(length=300), nullable=False),
        sa.Column("presentation_path", sa.String(length=500), nullable=True),
        sa.Column("status", campaign_status, nullable=False, server_default="DRAFT"),
        sa.Column("batch_size", sa.Integer(), nullable=False, server_default="100"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_email_campaigns_status", "email_campaigns", ["status"])

    op.create_table(
        "campaign_recipients",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("campaign_id", sa.Integer(), sa.ForeignKey("email_campaigns.id", ondelete="CASCADE"), nullable=False),
        sa.Column("company_name", sa.String(length=500), nullable=False, server_default=""),
        sa.Column("inn", sa.String(length=12), nullable=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("status", recipient_status, nullable=False, server_default="PENDING"),
        sa.Column("is_seed", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("error", sa.Text(), nullable=True),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("campaign_id", "email", name="uq_campaign_recipient_email"),
    )
    op.create_index("ix_campaign_recipients_campaign_id", "campaign_recipients", ["campaign_id"])
    op.create_index("ix_campaign_recipients_email", "campaign_recipients", ["email"])
    op.create_index("ix_campaign_recipients_status", "campaign_recipients", ["status"])

    op.create_table(
        "email_suppression",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("reason", suppression_reason, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("email", name="uq_email_suppression_email"),
    )
    op.create_index("ix_email_suppression_email", "email_suppression", ["email"])


def downgrade() -> None:
    op.drop_table("campaign_recipients")
    op.drop_table("email_suppression")
    op.drop_table("email_campaigns")
    sa.Enum(name="recipientstatus").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="campaignstatus").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="suppressionreason").drop(op.get_bind(), checkfirst=True)
