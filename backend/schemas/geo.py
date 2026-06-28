from pydantic import BaseModel


class GeoPointSchema(BaseModel):
    "Точка геокодера: координаты, адрес, населённый пункт."
    lat: float
    lng: float
    address: str
    city: str | None = None


class GeoSuggestResponse(BaseModel):
    "Список кандидатов прямого геокодирования."
    items: list[GeoPointSchema]
