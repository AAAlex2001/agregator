"Клиент DaData для подсказок по ИНН: запрос карточки юр.лица для автозаполнения профиля."

import os
from typing import Any

import httpx

DADATA_PARTY_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party"


async def fetch_dadata_party_by_inn(inn: str) -> dict[str, Any] | None:
    "Запрашивает у DaData карточку компании по ИНН; возвращает первую совпавшую suggestion или None."
    token = os.getenv("DADATA_API_KEY", "")
    if not token:
        return None
    headers = {"Authorization": f"Token {token}", "Content-Type": "application/json"}
    secret = os.getenv("DADATA_SECRET_KEY", "")
    if secret:
        headers["X-Secret"] = secret
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                DADATA_PARTY_URL,
                headers=headers,
                json={"query": inn, "count": 10},
            )
    except httpx.HTTPError:
        return None
    if response.status_code >= 400:
        return None
    suggestions = response.json().get("suggestions", []) or []
    for suggestion in suggestions:
        data = suggestion.get("data") or {}
        if data.get("inn") == inn:
            return suggestion
    return None
