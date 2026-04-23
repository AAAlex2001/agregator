from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.landing import LandingSnapshot
from services.landing import LandingService


router = APIRouter(tags=["landing"])


@router.get("/public/landing", response_model=LandingSnapshot)
async def get_landing_snapshot(db: AsyncSession = Depends(get_db)) -> LandingSnapshot:
    return await LandingService(db).get_snapshot()
