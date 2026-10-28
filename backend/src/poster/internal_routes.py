from fastapi import APIRouter

from src.poster.comments.internal_routes import router as comments_router
from src.poster.posts.internal_routes import router as posts_router
from src.poster.reports.internal_routes import router as reports_router

router = APIRouter()
router.include_router(reports_router)
router.include_router(comments_router)
router.include_router(posts_router)
