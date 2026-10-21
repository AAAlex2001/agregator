"""Ошибки аудита СУПБ."""

from app.blitz.orders.services.exceptions import OrderAccessError


class AuditorRequiredError(OrderAccessError):
    """Брать заявки на аудит и входить в группы может эксперт с анкетой «Аудит СУПБ»."""

    message = "Заполните анкету «Аудит СУПБ» в настройках, чтобы работать с заявками на аудит"
