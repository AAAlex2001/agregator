from datetime import UTC, datetime

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Общий предок всех таблиц."""


def utc_now() -> datetime:
    """Возвращает текущее время в UTC. Используется как время по умолчанию в таблицах."""
    return datetime.now(UTC)
