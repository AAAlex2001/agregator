from functools import lru_cache
from pathlib import Path

from dotenv import find_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"


class Settings(BaseSettings):
    """Настройки из переменных окружения и файла .env."""

    model_config = SettingsConfigDict(env_file=find_dotenv(), extra="ignore")

    database_url: str
    db_pool_size: int = 20
    db_max_overflow: int = 20

    internal_api_token: str = ""

    telegram_bot_token: str = ""
    telegram_proxy: str = ""

    proxyapi_key: str = ""
    ai_base_url: str = "https://api.proxyapi.ru/v1"
    ai_model: str = "deepseek/deepseek-v3.2"
    ai_requests_per_hour: int = 30


@lru_cache
def get_settings() -> Settings:
    """Читает настройки один раз и дальше отдаёт их же."""
    return Settings()
