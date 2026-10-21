"""Ошибки аудита СУПБ."""

from app.blitz.orders.services.exceptions import InvalidOrderError, OrderAccessError


class AuditLeadRequiredError(OrderAccessError):
    """Шаг руководителя аудиторской группы."""

    message = "Действие доступно руководителю аудиторской группы"


class NotAuditorError(InvalidOrderError):
    """Руководителем группы назначают только эксперта с анкетой аудитора."""

    message = "У эксперта нет анкеты аудитора"
