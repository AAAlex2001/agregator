from src.core.errors import AppError


class TooManyAiRequestsError(AppError):
    """За последний час пользователь исчерпал лимит запросов к ИИ. Текст — через сколько минут можно."""

    status_code = 429


class AiUnavailableError(AppError):
    """Нейросеть не ответила или ответила пустым текстом."""

    status_code = 503
    message = "ИИ-помощник сейчас не отвечает. Попробуйте ещё раз чуть позже"
