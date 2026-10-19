"""Переходник: ключ посетителя теперь в app.core.visitor. Удалится, когда роуты переедут в app/."""

from app.core.visitor import get_visitor_key, interaction_key

__all__ = ["get_visitor_key", "interaction_key"]
