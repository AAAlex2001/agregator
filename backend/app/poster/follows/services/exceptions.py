"""Ошибки подписок."""

from app.core.errors import AppError


class AuthorNotFoundError(AppError):
    """Автора нет или его аккаунт отключён."""

    status_code = 404
    message = "Автор не найден"


class SelfFollowError(AppError):
    """Подписка на самого себя."""

    message = "Нельзя подписаться на себя"
