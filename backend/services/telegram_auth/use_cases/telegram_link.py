"Use case: привязка Telegram к существующему аккаунту по email+паролю."
from models.user import User, UserRole
from schemas.login import UserLogin
from services.login.repository import LoginRepository
from services.login.use_cases.authenticate_user import AuthenticateUserUseCase
from services.login.validators import LoginValidator
from services.telegram_auth.init_data import telegram_user_id


class TelegramLinkUseCase:
    "Проверяет initData, аутентифицирует по email/паролю и проставляет telegram_id."

    def __init__(self, repo: LoginRepository, validator: LoginValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self,
        init_data: str,
        email: str,
        password: str,
        role: UserRole | None,
    ) -> User:
        tg_id = telegram_user_id(init_data)
        login = UserLogin(email=email, password=password, role=role)
        user = await AuthenticateUserUseCase(self.repo, self.validator).execute(login)
        await self.repo.set_telegram_id(user.id, tg_id)
        return user
