"""Языковая модель через ProxyAPI в формате OpenAI Chat Completions."""

from typing import Any

import httpx

TIMEOUT_SECONDS = 90
TEMPERATURE = 0.7


class AiError(Exception):
    """Модель не ответила: нет ключа, сеть, лимиты или пустой ответ."""


class AiClient:
    """Клиент модели: ключ, адрес и название модели из настроек."""

    def __init__(self, api_key: str, base_url: str, model: str) -> None:
        self.api_key = api_key
        self.base_url = base_url
        self.model = model

    async def complete(self, system: str, user: str, max_tokens: int) -> str:
        """Ответ модели на системную инструкцию и сообщение пользователя. Ошибки — AiError."""

        if not self.api_key:
            raise AiError("Не задан PROXYAPI_KEY")

        body = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "max_tokens": max_tokens,
            "temperature": TEMPERATURE,
        }

        try:
            async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    json=body,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                )
                response.raise_for_status()
                data = response.json()
        except (httpx.HTTPError, ValueError) as error:
            raise AiError(str(error)) from error

        return answer_text(data)


def answer_text(data: Any) -> str:
    """Текст первого ответа модели. Нет текста — AiError."""

    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as error:
        raise AiError("Неверный формат ответа модели") from error

    if not isinstance(content, str) or not content.strip():
        raise AiError("Пустой ответ модели")

    return content
