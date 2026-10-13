from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"


class PostSettings(BaseSettings):
    """Настройки ИИ-помощника публикаций из окружения."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    proxyapi_key: str = ""
    ai_base_url: str = "https://api.proxyapi.ru/v1"
    ai_model: str = "deepseek/deepseek-v3.2"
    ai_requests_per_hour: int = Field(30, ge=1)


@lru_cache
def get_settings() -> PostSettings:
    """Читает настройки ИИ один раз при первом запросе."""
    return PostSettings()
