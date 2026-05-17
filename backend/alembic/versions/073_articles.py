"""articles

Revision ID: 073
Revises: 072
"""
from typing import Sequence, Union

from alembic import op


revision: str = "073"
down_revision: Union[str, None] = "072"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'articlekind') THEN
                CREATE TYPE articlekind AS ENUM ('NEWS', 'BLOG');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'articlestatus') THEN
                CREATE TYPE articlestatus AS ENUM ('DRAFT', 'PUBLISHED');
            END IF;
        END$$;
        """
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS articles (
            id              SERIAL PRIMARY KEY,
            kind            articlekind NOT NULL,
            status          articlestatus NOT NULL DEFAULT 'DRAFT',
            slug            VARCHAR(220) NOT NULL UNIQUE,
            title           VARCHAR(300) NOT NULL DEFAULT '',
            excerpt         TEXT NOT NULL DEFAULT '',
            cover_image     VARCHAR(500) NOT NULL DEFAULT '',
            content_html    TEXT NOT NULL DEFAULT '',
            tags            JSONB NOT NULL DEFAULT '[]'::jsonb,
            meta_title      VARCHAR(300) NOT NULL DEFAULT '',
            meta_description TEXT NOT NULL DEFAULT '',
            meta_keywords   TEXT NOT NULL DEFAULT '',
            og_image        VARCHAR(500) NOT NULL DEFAULT '',
            published_at    TIMESTAMPTZ,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute("CREATE INDEX IF NOT EXISTS ix_articles_kind ON articles (kind)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_articles_status ON articles (status)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_articles_published_at ON articles (published_at)")
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_articles_kind_status_published "
        "ON articles (kind, status, published_at DESC)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_articles_kind_status_published")
    op.execute("DROP INDEX IF EXISTS ix_articles_published_at")
    op.execute("DROP INDEX IF EXISTS ix_articles_status")
    op.execute("DROP INDEX IF EXISTS ix_articles_kind")
    op.execute("DROP TABLE IF EXISTS articles")
    op.execute("DROP TYPE IF EXISTS articlestatus")
    op.execute("DROP TYPE IF EXISTS articlekind")
