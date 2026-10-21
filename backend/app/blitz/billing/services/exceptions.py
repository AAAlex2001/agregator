"""Ошибки счетов."""

from app.blitz.orders.services.exceptions import OrderError


class InvoiceNotFoundError(OrderError):
    """Счёта нет или он от другой заявки."""

    status_code = 404
    message = "Счёт не найден"
