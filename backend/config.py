from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class EmailConfig(BaseSettings):
    "Все email-переменные окружения в одном месте. Никаких os.getenv по файлам."
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    email_from: str
    email_from_name: str = "Ресурс-Плюс"
    email_reply_to: str | None = None

    unisender_go_api_key: str
    unisender_go_endpoint: str = "https://go1.unisender.ru"

    attachments_max_total_bytes: int = 15 * 1024 * 1024

    public_base_url: str = "https://plus-resurs.com"
    mailing_token_secret: str | None = None

    mailing_daily_limit: int = 0
    mailing_chunk_size: int = 200
    mailing_chunk_pause_seconds: float = 1.0

    @model_validator(mode="after")
    def fill_defaults(self) -> "EmailConfig":
        if not self.email_reply_to:
            object.__setattr__(self, "email_reply_to", self.email_from)
        if not self.mailing_token_secret:
            object.__setattr__(self, "mailing_token_secret", self.unisender_go_api_key)
        return self


email_config = EmailConfig()


class TelegramConfig(BaseSettings):
    "Настройки Telegram-бота / мини-аппа."
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    telegram_bot_token: str = ""


telegram_config = TelegramConfig()