from fastapi import APIRouter

from src.poster.ai.routes import router as ai_router
from src.poster.channels.routes import router as channels_router
from src.poster.comments.routes import router as comments_router
from src.poster.feed.routes import router as feed_router
from src.poster.follows.routes import router as follows_router
from src.poster.posts.routes import router as posts_router
from src.poster.reactions.routes import router as reactions_router
from src.poster.reports.routes import router as reports_router
from src.poster.templates.routes import router as templates_router

router = APIRouter()
router.include_router(channels_router)
router.include_router(templates_router)
router.include_router(ai_router)
router.include_router(follows_router)
router.include_router(comments_router)
router.include_router(reports_router)
router.include_router(reactions_router)
router.include_router(posts_router)
router.include_router(feed_router)
