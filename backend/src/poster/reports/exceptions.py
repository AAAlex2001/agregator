from src.core.errors import AppError


class ReportNotFoundError(AppError):
    """Жалобы с таким id нет."""

    status_code = 404
    message = "Жалоба не найдена"
