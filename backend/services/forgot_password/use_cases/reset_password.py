from models.user import User
from services.forgot_password.repository import ForgotPasswordRepository
from services.forgot_password.validators import ForgotPasswordValidator
from services.verification import VerificationService
from utils.passwords import hash_password


class ResetPasswordUseCase:
    "Сбрасывает пароль (consume code) и синхронизирует пароль для всех аккаунтов на этом email/phone."

    def __init__(
        self,
        repo: ForgotPasswordRepository,
        validator: ForgotPasswordValidator,
        verification: VerificationService,
    ):
        self.repo = repo
        self.validator = validator
        self.verification = verification

    async def execute(
        self,
        email: str | None,
        phone: str | None,
        code: str,
        new_password: str,
    ) -> User:
        self.validator.ensure_password_strong(new_password)
        user = await self.validator.find_user(email, phone)
        await self.verification.consume_code(user.id, code)

        hashed = await hash_password(new_password)
        user.password = hashed

        siblings: list[User] = []
        if user.email:
            siblings = await self.repo.list_users_by_email(user.email)
        elif user.phone:
            siblings = await self.repo.list_users_by_phone(user.phone)
        for sibling in siblings:
            if sibling.id != user.id:
                sibling.password = hashed

        return user
