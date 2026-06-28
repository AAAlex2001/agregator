"Сервисный модуль: geo (HTTP-геокодер Яндекса)."
import os
from dataclasses import dataclass

import httpx
from fastapi import HTTPException, status

GEOCODER_URL = "https://geocode-maps.yandex.ru/1.x/"


@dataclass(frozen=True)
class GeoPoint:
    "Точка карты: координаты, адрес, населённый пункт."

    lat: float
    lng: float
    address: str
    city: str | None


class YandexGeocoderService:
    "Прокси к HTTP-геокодеру Яндекса. Ключ — серверный секрет, в браузер не попадает."

    def __init__(self) -> None:
        self.apikey = os.getenv("YANDEX_GEOCODER_API_KEY", "")

    async def suggest(self, query: str, count: int = 6) -> list[GeoPoint]:
        "Прямое геокодирование строки адреса в список кандидатов."
        return await self.geocode(query, count)

    async def reverse(self, lat: float, lng: float) -> GeoPoint | None:
        "Обратное геокодирование координат в адрес."
        points = await self.geocode(f"{lng},{lat}", 1)
        return points[0] if points else None

    async def geocode(self, geocode: str, count: int) -> list[GeoPoint]:
        "Запрос к геокодеру и разбор ответа."
        if not self.apikey:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Геокодер не настроен",
            )
        params = {
            "apikey": self.apikey,
            "format": "json",
            "geocode": geocode,
            "results": count,
            "lang": "ru_RU",
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GEOCODER_URL, params=params)
        if response.status_code >= 400:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Геокодер недоступен",
            )
        members = (
            response.json()
            .get("response", {})
            .get("GeoObjectCollection", {})
            .get("featureMember", [])
        )
        points: list[GeoPoint] = []
        for member in members:
            point = self.parse(member)
            if point is not None:
                points.append(point)
        return points

    def parse(self, member: dict) -> GeoPoint | None:
        "Разбирает один объект геокодера в точку."
        geo_object = member.get("GeoObject") or {}
        pos = (geo_object.get("Point") or {}).get("pos")
        if not pos:
            return None
        lng_str, lat_str = pos.split(" ")
        meta = (geo_object.get("metaDataProperty") or {}).get("GeocoderMetaData") or {}
        components = (meta.get("Address") or {}).get("Components") or []
        return GeoPoint(
            lat=float(lat_str),
            lng=float(lng_str),
            address=meta.get("text") or geo_object.get("name") or "",
            city=self.pick_city(components),
        )

    def pick_city(self, components: list[dict]) -> str | None:
        "Выбирает населённый пункт из компонент адреса, иначе регион."
        locality = next((c.get("name") for c in components if c.get("kind") == "locality"), None)
        if locality:
            return locality
        return next((c.get("name") for c in components if c.get("kind") == "province"), None)
