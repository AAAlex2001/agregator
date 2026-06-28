from fastapi import APIRouter, Depends, Query

from dependencies.rate_limit import rate_limit
from schemas.geo import GeoPointSchema, GeoSuggestResponse
from services.geo import GeoPoint, YandexGeocoderService

router = APIRouter(prefix="/geo", tags=["geo"])

RATE_LIMIT = Depends(rate_limit("geo", max_calls=60, window_seconds=60))


def to_schema(point: GeoPoint) -> GeoPointSchema:
    return GeoPointSchema(lat=point.lat, lng=point.lng, address=point.address, city=point.city)


@router.get("/suggest", response_model=GeoSuggestResponse, dependencies=[RATE_LIMIT])
async def suggest(q: str = Query(..., min_length=2, max_length=200)) -> GeoSuggestResponse:
    "Прямое геокодирование строки адреса в список кандидатов (для подсказок пикера)."
    points = await YandexGeocoderService().suggest(q)
    return GeoSuggestResponse(items=[to_schema(point) for point in points])


@router.get("/reverse", response_model=GeoPointSchema, dependencies=[RATE_LIMIT])
async def reverse(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
) -> GeoPointSchema:
    "Обратное геокодирование координат точки (клик/перетаскивание по карте) в адрес."
    point = await YandexGeocoderService().reverse(lat, lng)
    if point is None:
        return GeoPointSchema(lat=lat, lng=lng, address="", city=None)
    return to_schema(point)
