import httpx

from src.core.config import get_settings

TIMEOUT_SECONDS = 90


class AiError(Exception):
    """Нейросеть не ответила: сервис недоступен или вернул ошибку."""


class AiClient:
    """Задаёт вопросы нейросети через сервис с OpenAI-совместимым API."""

    def __init__(self, api_key: str, base_url: str, model: str) -> None:
        """Запоминает ключ доступа, адрес сервиса и название модели."""
        self.api_key = api_key
        self.base_url = base_url
        self.model = model

    async def complete(self, system_prompt: str, user_message: str, max_tokens: int) -> str:
        """Отправляет нейросети инструкцию и сообщение и возвращает её ответ текстом."""
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
        }
        headers = {"Authorization": f"Bearer {self.api_key}"}
        url = f"{self.base_url}/chat/completions"

        try:
            async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
        except httpx.HTTPError as error:
            raise AiError(str(error)) from error

        return response.json()["choices"][0]["message"]["content"]


def get_ai() -> AiClient:
    """Создаёт клиент нейросети с ключом и моделью из настроек."""
    settings = get_settings()

    return AiClient(settings.proxyapi_key, settings.ai_base_url, settings.ai_model)
