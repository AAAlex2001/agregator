from src.core.errors import AppError


class ChannelNotFoundError(AppError):
    """Канала нет или он чужой: для пользователя это одно и то же."""

    status_code = 404
    message = "Канал не найден"

