"Use case: вход по Telegram initData (поиск привязанного пользователя)."
from models.user import User
from services.login.repository import LoginRepository
from services.telegram_auth.init_data import telegram_user_id


class TelegramLoginUseCase:
    "Возвращает пользователя, привязанного к Telegram, либо None."

    def __init__(self, repo: LoginRepository) -> None:
        self.repo = repo

    async def execute(self, init_data: str) -> User | None:
        tg_id = telegram_user_id(init_data)
        return await self.repo.find_user_by_telegram_id(tg_id)
