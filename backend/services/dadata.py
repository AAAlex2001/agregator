"Сервисный модуль: dadata."
import os
from typing import Any, TypedDict

import httpx
from fastapi import HTTPException, status

DADATA_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party"


class PartySuggestion(TypedDict):
    "Одна подсказка организации из DaData. Поле data — произвольный JSON от провайдера."
    value: str
    unrestricted_value: str
    data: dict[str, Any]


class DaDataService:
    "Сервис домена: инкапсулирует операции и зависимости."
    def __init__(self) -> None:
        self.token = os.getenv("DADATA_API_KEY", "")
        self.secret = os.getenv("DADATA_SECRET_KEY", "")

    async def suggest_parties(self, query: str, count: int = 10) -> list[PartySuggestion]:
        "Публичный метод сервисного слоя."
        if not self.token:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Интеграция с DaData не настроена",
            )

        headers = {
            "Authorization": f"Token {self.token}",
            "Content-Type": "application/json",
        }
        if self.secret:
            headers["X-Secret"] = self.secret

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                DADATA_URL,
                headers=headers,
                json={"query": query, "count": count},
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Не удалось получить подсказки DaData",
            )

        body = response.json()
        return body.get("suggestions", [])
