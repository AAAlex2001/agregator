"""Ошибки входа по сессии. Тексты различаются: фронт по ним решает, продлевать ли сессию."""

from app.core.errors import AppError


class NotAuthenticatedError(AppError):
    """Нет cookie сессии или аккаунт отключён."""

    status_code = 401
    message = "Необходима авторизация"


class SessionNotFoundError(AppError):
    """Сессии из cookie нет в базе."""

    status_code = 401
    message = "Сессия не найдена или истекла"


class SessionExpiredError(AppError):
    """Предельный срок сессии прошёл — нужен новый вход."""

    status_code = 401
    message = "Сессия истекла"


class SessionRefreshRequiredError(AppError):
    """Срок продления прошёл — сессию нужно обновить."""

    status_code = 401
    message = "Требуется обновление сессии"
