"""Ошибки заявок Блиц-эксперта."""

from app.core.errors import AppError


class OrderError(AppError):
    """Ошибка заявки."""


class OrderNotFoundError(OrderError):
    """Заявки нет или она недоступна."""

    status_code = 404
    message = "Заявка не найдена"


class OrderStateError(OrderError):
    """Действие не подходит текущему статусу: шаг уже пройден или ещё не наступил."""

    status_code = 409


class OrderAccessError(OrderError):
    """Действие доступно другой стороне заявки."""

    status_code = 403


class InvalidOrderError(OrderError):
    """Данные заявки не проходят проверку."""

    status_code = 422


class CustomerRequiredError(OrderAccessError):
    """Заявку подаёт и ведёт заказчик."""

    message = "Действие доступно заказчику"


class ExpertRequiredError(OrderAccessError):
    """Заявку берёт и ведёт эксперт."""

    message = "Действие доступно эксперту"
