"""Переходник: Base теперь в app.core.base. Удалится, когда модели переедут в app/."""

from app.core.base import Base

__all__ = ["Base"]
