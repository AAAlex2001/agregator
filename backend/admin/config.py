"Настройки админ-панели: креды доступа и токен Я.Метрики из окружения."

from pydantic_settings import BaseSettings, SettingsConfigDict


class AdminConfig(BaseSettings):
    "ENV-конфиг для админки. Подтягивается из .env, регистр не важен."

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    admin_username: str = "admin"
    admin_password: str = "change-me-in-env"
    admin_session_secret: str = "change-me-in-env-session-secret"

    yandex_metrika_counter_id: int = 108708847
    yandex_metrika_oauth_token: str | None = None


admin_config = AdminConfig()
