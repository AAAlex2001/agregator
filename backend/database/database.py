"""Переходник: сессия БД теперь в app.core.database. Удалится, когда старый код переедет в app/."""

from dotenv import load_dotenv

from app.core.database import SessionLocal as AsyncSessionLocal
from app.core.database import get_db

load_dotenv()

__all__ = ["AsyncSessionLocal", "get_db"]
