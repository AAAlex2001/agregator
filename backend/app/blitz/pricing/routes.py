"""Тарифы на витрине Блиц-эксперта."""

from fastapi import APIRouter, Depends

from app.blitz.pricing.dependencies import get_tariff_repository
from app.blitz.pricing.schemas import TariffSchema
from app.blitz.pricing.services.repo import TariffRepository

router = APIRouter(tags=["blitz"])


@router.get("/tariffs")
async def list_tariffs(tariffs: TariffRepository = Depends(get_tariff_repository)) -> list[TariffSchema]:
    """Ориентиры цены по парам «область × объект»."""

    return [TariffSchema.model_validate(item) for item in await tariffs.list_all()]
