"""Текущее время для записей в базе."""

from datetime import UTC, datetime


def now() -> datetime:
    """Текущий момент в UTC."""

    return datetime.now(UTC)
