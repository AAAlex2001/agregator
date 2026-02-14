"""Add orders and order_badges tables

Revision ID: 002
Revises: 001
Create Date: 2026-02-14 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('sum_amount', sa.Integer(), nullable=False),
        sa.Column('deadline', sa.Date(), nullable=False),
        sa.Column(
            'status',
            sa.Enum('ACTIVE', 'COMPLETED', 'ARCHIVED', name='orderstatus'),
            nullable=False,
            server_default='ACTIVE',
        ),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text('now()'),
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text('now()'),
        ),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_orders_id'), 'orders', ['id'], unique=False)
    op.create_index(op.f('ix_orders_customer_id'), 'orders', ['customer_id'], unique=False)
    op.create_index(op.f('ix_orders_status'), 'orders', ['status'], unique=False)

    op.create_table(
        'order_badges',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('text', sa.String(length=50), nullable=False),
        sa.Column(
            'variant',
            sa.Enum('BLUE', 'GREEN', name='badgevariant'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_order_badges_id'), 'order_badges', ['id'], unique=False)
    op.create_index(op.f('ix_order_badges_order_id'), 'order_badges', ['order_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_order_badges_order_id'), table_name='order_badges')
    op.drop_index(op.f('ix_order_badges_id'), table_name='order_badges')
    op.drop_table('order_badges')
    op.drop_index(op.f('ix_orders_status'), table_name='orders')
    op.drop_index(op.f('ix_orders_customer_id'), table_name='orders')
    op.drop_index(op.f('ix_orders_id'), table_name='orders')
    op.drop_table('orders')
    op.execute('DROP TYPE orderstatus')
    op.execute('DROP TYPE badgevariant')
