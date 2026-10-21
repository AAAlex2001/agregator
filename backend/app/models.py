"""Реестр моделей app/: импорт собирает все таблицы для alembic и строковых связей."""

from app.auth.sessions import models as sessions
from app.blitz.billing import models as blitz_billing
from app.blitz.documents import models as blitz_documents
from app.blitz.orders import models as blitz_orders
from app.blitz.payments import models as blitz_payments
from app.blitz.pricing import models as blitz_pricing
from app.blitz.work import models as blitz_work
from app.poster.ai import models as poster_ai
from app.poster.channels import models as poster_channels
from app.poster.comments import models as poster_comments
from app.poster.delivery import models as poster_delivery
from app.poster.follows import models as poster_follows
from app.poster.media import models as poster_media
from app.poster.publications import models as poster_publications
from app.poster.reactions import models as poster_reactions
from app.poster.reports import models as poster_reports
from app.poster.templates import models as poster_templates
from app.support import models as support
from app.telegram.link import models as telegram_link

__all__ = [
    "blitz_billing",
    "blitz_documents",
    "blitz_orders",
    "blitz_payments",
    "blitz_pricing",
    "blitz_work",
    "poster_ai",
    "poster_channels",
    "poster_comments",
    "poster_delivery",
    "poster_follows",
    "poster_media",
    "poster_publications",
    "poster_reactions",
    "poster_reports",
    "poster_templates",
    "sessions",
    "support",
    "telegram_link",
]
