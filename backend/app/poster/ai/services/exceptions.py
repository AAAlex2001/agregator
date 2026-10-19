"""Ошибки ИИ-помощника."""

import math

from app.core.errors import AppError


class TooManyAiRequestsError(AppError):
    """Лимит запросов к ИИ на час исчерпан."""

    status_code = 429

    def __init__(self, retry_after: int) -> None:
        minutes = math.ceil(retry_after / 60)
        super().__init__(f"Лимит запросов к ИИ исчерпан. Попробуйте через {minutes} мин")
        self.retry_after = retry_after
        self.headers = {"Retry-After": str(retry_after)}


class AiUnavailableError(AppError):
    """Модель не ответила или ответила пустым текстом."""

    status_code = 503
    message = "ИИ-помощник сейчас не отвечает. Попробуйте ещё раз чуть позже"
