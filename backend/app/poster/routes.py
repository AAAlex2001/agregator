"""Все роуты постера под /posts. Модерация подключается отдельно: app.poster.moderation.routes.

Ленты подключены первыми: их пути вроде /feed и /my не должны попасть в /{post_id}.
"""

from fastapi import APIRouter

from app.poster.ai.routes import router as ai_router
from app.poster.comments.routes import router as comments_router
from app.poster.feed.routes import router as feed_router
from app.poster.follows.routes import router as follows_router
from app.poster.media.routes import router as media_router
from app.poster.publications.routes import router as publications_router
from app.poster.reactions.routes import router as reactions_router
from app.poster.reports.routes import router as reports_router
from app.poster.reposts.routes import router as reposts_router

PREFIX = "/posts"

router = APIRouter(tags=["posts"])
router.include_router(feed_router, prefix=PREFIX)
router.include_router(media_router, prefix=PREFIX)
router.include_router(ai_router, prefix=PREFIX)
router.include_router(follows_router, prefix=PREFIX)
router.include_router(comments_router, prefix=PREFIX)
router.include_router(reports_router, prefix=PREFIX)
router.include_router(reactions_router, prefix=PREFIX)
router.include_router(reposts_router, prefix=PREFIX)
router.include_router(publications_router, prefix=PREFIX)
