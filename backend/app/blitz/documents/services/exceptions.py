"""Ошибки файлов заявки."""

from app.blitz.orders.services.exceptions import OrderError


class DocumentNotFoundError(OrderError):
    """Файла нет в заявке или на диске."""

    status_code = 404
    message = "Файл не найден"
