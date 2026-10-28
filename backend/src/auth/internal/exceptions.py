from src.core.errors import AppError


class InternalTokenMissingError(AppError):
    """Секрет админки не задан на сервере: адреса админки выключены."""

    status_code = 503
    message = "INTERNAL_API_TOKEN не настроен на сервере"


class InternalTokenInvalidError(AppError):
    """Заголовок X-Internal-Token не совпал с секретом."""

    status_code = 401
    message = "Неверный internal token"
