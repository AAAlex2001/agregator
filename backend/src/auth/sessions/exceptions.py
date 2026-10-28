from src.core.errors import AppError


class NotAuthenticatedError(AppError):
    """Нет cookie сессии или аккаунт отключён."""

    status_code = 401
    message = "Необходима авторизация"


class SessionNotFoundError(AppError):
    """Сессии из cookie нет в базе."""

    status_code = 401
    message = "Сессия не найдена или истекла"


class SessionExpiredError(AppError):
    """Предельный срок сессии прошёл: нужно войти заново."""

    status_code = 401
    message = "Сессия истекла"


class SessionRefreshRequiredError(AppError):
    """Срок продления прошёл: фронт должен обновить сессию. Текст ошибки фронт сверяет как есть."""

    status_code = 401
    message = "Требуется обновление сессии"
