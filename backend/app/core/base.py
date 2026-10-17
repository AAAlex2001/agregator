"""Общий предок моделей. Отдельно от подключения, чтобы модели импортировались без базы."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Предок всех таблиц."""
