"""Сумма платежа: в таблице payments она хранится в копейках."""

from decimal import Decimal

KOPECKS_PER_RUBLE = 100


def to_kopecks(amount: Decimal) -> int:
    """Рубли в копейки."""

    return int(amount * KOPECKS_PER_RUBLE)


def to_rubles(kopecks: int) -> Decimal:
    """Копейки в рубли."""

    return Decimal(kopecks) / KOPECKS_PER_RUBLE
