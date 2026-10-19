"""Настройки приложения из окружения и ближайшего .env."""

from functools import lru_cache

from dotenv import find_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Подключения к базе, ИИ-модели и Telegram-боту, токен админки."""

    model_config = SettingsConfigDict(env_file=find_dotenv(), extra="ignore")

    database_url: str
    echo_sql: bool = False
    db_pool_size: int = 20
    db_max_overflow: int = 20
    db_pool_timeout: int = 30
    db_pool_recycle: int = 1800
    db_command_timeout: int = 30

    internal_api_token: str = ""

    telegram_bot_token: str = ""
    telegram_proxy: str = ""

    proxyapi_key: str = ""
    ai_base_url: str = "https://api.proxyapi.ru/v1"
    ai_model: str = "deepseek/deepseek-v3.2"
    ai_requests_per_hour: int = Field(30, ge=1)


@lru_cache
def get_settings() -> Settings:
    """Настройки читаются один раз."""

    return Settings()
