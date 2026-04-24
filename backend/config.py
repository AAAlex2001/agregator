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

    @model_validator(mode="after")
    def default_reply_to(self) -> "EmailConfig":
        if not self.email_reply_to:
            object.__setattr__(self, "email_reply_to", self.email_from)
        return self


email_config = EmailConfig()
