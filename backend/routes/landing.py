from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.landing import LandingReviewDto, LandingSnapshot
from services.landing import LandingService

router = APIRouter(tags=["landing"])


@router.get("/public/landing", response_model=LandingSnapshot)
async def get_landing_snapshot(db: AsyncSession = Depends(get_db)) -> LandingSnapshot:
    "Возвращает агрегированный публичный снапшот лендинга."
    return await LandingService(db).get_snapshot()


@router.get("/public/reviews", response_model=list[LandingReviewDto])
async def list_public_reviews(db: AsyncSession = Depends(get_db)) -> list[LandingReviewDto]:
    "Возвращает публичный список отзывов для главной страницы."
    return await LandingService(db).get_reviews()
