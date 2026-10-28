from src.core.errors import AppError


class AuthorNotFoundError(AppError):
    """Автора с таким id нет."""

    status_code = 404
    message = "Автор не найден"


class SelfFollowError(AppError):
    """Человек пытается подписаться сам на себя."""

    message = "Нельзя подписаться на себя"
