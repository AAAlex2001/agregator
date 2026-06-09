"Диспетчер: маршрутизирует задачи между обработчиками."
import logging

from fastapi import BackgroundTasks
from pydantic import BaseModel

from models.user import User
from utils.email import send_email
from utils.email_templates import render_email
from utils.request_context import request_id_var

logger = logging.getLogger(__name__)


async def deliver_email_task(
    recipient_email: str,
    subject: str,
    text: str,
    html: str,
) -> None:
    "BackgroundTasks-обёртка: отправка письма, ошибка SMTP только в лог."
    request_id = request_id_var.get()
    try:
        await send_email(recipient_email, subject, text, html)
    except Exception:
        logger.exception(
            "Не удалось отправить письмо на %s [request_id=%s]",
            recipient_email,
            request_id,
        )


class EmailDispatcher:
    "Рендерит шаблон и ставит отправку в BackgroundTasks. Сам письма не шлёт."

    def __init__(self, background_tasks: BackgroundTasks) -> None:
        self.background_tasks = background_tasks

    def dispatch(
        self,
        recipient_email: str,
        template_name: str,
        subject: str,
        context: BaseModel,
    ) -> None:
        "Публичный метод сервисного слоя."
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
