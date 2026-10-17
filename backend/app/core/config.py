"""Настройки приложения из окружения и ближайшего .env."""

from functools import lru_cache

from dotenv import find_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Подключения к базе и Redis."""

    model_config = SettingsConfigDict(env_file=find_dotenv(), extra="ignore")

    database_url: str
    echo_sql: bool = False
    db_pool_size: int = 20
    db_max_overflow: int = 20
    db_pool_timeout: int = 30
    db_pool_recycle: int = 1800
    db_command_timeout: int = 30

    redis_url: str = "redis://redis:6379/0"


@lru_cache
def get_settings() -> Settings:
    """Настройки читаются один раз."""

    return Settings()
