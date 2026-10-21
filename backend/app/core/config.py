"""Настройки приложения из окружения и ближайшего .env."""

from functools import lru_cache

from dotenv import find_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Подключения к базе, ИИ-модели, Telegram-боту и ЮKassa, токен админки, адрес сайта."""

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

    public_base_url: str = "https://plus-resurs.com"
    admin_notify_emails: str = ""

    yookassa_shop_id: str = ""
    yookassa_secret_key: str = ""
    yookassa_vat_code: int = 1
    company_vat_rate: int = Field(0, ge=0, le=20)

    @property
    def admin_emails(self) -> list[str]:
        """Почты администраторов из ADMIN_NOTIFY_EMAILS через запятую."""

        return [email.strip() for email in self.admin_notify_emails.split(",") if email.strip()]


@lru_cache
def get_settings() -> Settings:
    """Настройки читаются один раз."""

    return Settings()
