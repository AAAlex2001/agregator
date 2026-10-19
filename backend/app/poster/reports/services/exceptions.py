"""Ошибки жалоб."""

from app.core.errors import AppError


class ReportNotFoundError(AppError):
    """Жалобы нет."""

    status_code = 404
    message = "Жалоба не найдена"
