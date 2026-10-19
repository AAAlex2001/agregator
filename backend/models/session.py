"""Переходник: Session теперь в app.auth.sessions.models. Удалится, когда старый код переедет в app/."""

from app.auth.sessions.models import Session

__all__ = ["Session"]
