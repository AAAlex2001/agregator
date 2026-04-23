import logging
from datetime import datetime, timezone

from fastapi import BackgroundTasks, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.password_reset_code import PasswordResetCode
from models.user import User
from utils.code import generate_numeric_code
from utils.email import send_email
from utils.email_templates import render_email

logger = logging.getLogger(__name__)

VERIFICATION_CODE_TTL_MINUTES = 15


async def deliver_code_email(email: str, subject: str, text: str, html: str) -> None:
    "Обёртка для BackgroundTasks: отправляет письмо, ошибки SMTP пишет в лог, но не роняет запрос."
    try:
        await send_email(email, subject, text, html)
    except Exception as exc:
        logger.exception("Не удалось отправить код на %s: %s", email, exc)


class VerificationService:
    "Единый сервис для одноразовых кодов (email-подтверждение, сброс пароля)."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def issue_code(self, user_id: int) -> str:
        code = generate_numeric_code()
        self.db.add(PasswordResetCode(user_id=user_id, code=code))
        await self.db.flush()
        return code

    async def send_code_to_email(self, user_id: int, email: str, subject: str) -> str:
        code = await self.issue_code(user_id)
        rendered = self.render_code_email(subject, code)
        await send_email(email, rendered.subject, rendered.text, rendered.html)
        return code

    async def schedule_code_email(
        self,
        user_id: int,
        email: str,
        subject: str,
        background_tasks: BackgroundTasks,
    ) -> None:
        "Выпускает код в БД и ставит отправку письма в фон — клиент не ждёт SMTP."
        code = await self.issue_code(user_id)
        rendered = self.render_code_email(subject, code)
        background_tasks.add_task(
            deliver_code_email,
            email,
            rendered.subject,
            rendered.text,
            rendered.html,
        )

    @staticmethod
    def render_code_email(subject: str, code: str):
        return render_email(
            name="verification_code",
            subject=subject,
            context={
                "heading": subject,
                "intro": "Используйте одноразовый код, чтобы завершить действие на Ресурс-Плюс:",
                "code": code,
                "expire_minutes": VERIFICATION_CODE_TTL_MINUTES,
            },
        )

    async def find_active_code(self, user_id: int, code: str) -> PasswordResetCode | None:
        query = select(PasswordResetCode).where(
            PasswordResetCode.user_id == user_id,
            PasswordResetCode.code == code,
            PasswordResetCode.is_used == False,
            PasswordResetCode.expires_at > datetime.now(timezone.utc),
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def consume_code(self, user_id: int, code: str) -> PasswordResetCode:
        active = await self.find_active_code(user_id, code)
        if not active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный или истёкший код",
            )
        active.is_used = True
        return active

    async def ensure_code_valid(self, user_id: int, code: str) -> PasswordResetCode:
        active = await self.find_active_code(user_id, code)
        if not active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный или истёкший код",
            )
        return active

    async def confirm_email(self, user: User, code: str) -> User:
        await self.consume_code(user.id, code)
        user.email_verified = True
        return user
