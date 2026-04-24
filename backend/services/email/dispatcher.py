import logging

from fastapi import BackgroundTasks
from pydantic import BaseModel

from models.user import User
from utils.email import send_email
from utils.email_templates import render_email

logger = logging.getLogger(__name__)


async def deliver_email_task(
    recipient_email: str,
    subject: str,
    text: str,
    html: str,
) -> None:
    "BackgroundTasks-обёртка: отправка письма, ошибка SMTP только в лог."
    try:
        await send_email(recipient_email, subject, text, html)
    except Exception as exc:
        logger.exception("Не удалось отправить письмо на %s: %s", recipient_email, exc)


class EmailDispatcher:
    "Рендерит шаблон и ставит отправку в BackgroundTasks. Сам письма не шлёт."

    def __init__(self, background_tasks: BackgroundTasks):
        self.background_tasks = background_tasks

    def dispatch(
        self,
        recipient_email: str,
        template_name: str,
        subject: str,
        context: BaseModel,
    ) -> None:
        rendered = render_email(template_name, subject, context.model_dump())
        self.background_tasks.add_task(
            deliver_email_task,
            recipient_email,
            rendered.subject,
            rendered.text,
            rendered.html,
        )

    @staticmethod
    def can_send(user: User | None, preference_field: str) -> bool:
        "Проверка: есть ли email у пользователя и включено ли именно это уведомление."
        if user is None:
            return False
        if not user.email:
            return False
        return bool(getattr(user, preference_field, False))
