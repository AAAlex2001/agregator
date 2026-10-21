"""Ошибки заявок в конкурсную комиссию."""

from app.core.errors import AppError


class CommissionError(AppError):
    """Ошибка заявки в комиссию."""


class ApplicationNotFoundError(CommissionError):
    """Заявки нет."""

    status_code = 404
    message = "Заявка не найдена"


class InvalidAttestationError(CommissionError):
    """Аттестация не по справочнику."""

    status_code = 422
