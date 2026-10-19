"""Ошибки привязки Telegram."""

from app.core.errors import AppError


class BotUnavailableError(AppError):
    """Бот не настроен или Telegram не ответил."""

    status_code = 503
    message = "Telegram-бот сейчас недоступен. Попробуйте позже"
