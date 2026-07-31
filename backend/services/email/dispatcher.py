"Диспетчер: маршрутизирует задачи между обработчиками."
import html
import logging
import re

from fastapi import BackgroundTasks
from pydantic import BaseModel

from models.account import Account
from services.telegram_notify import send_telegram_message
from utils.email import send_email
from utils.email_templates import render_email
from utils.request_context import request_id_var

logger = logging.getLogger(__name__)


def preference_enabled(account: Account, preference_field: str) -> bool:
    "Тумблер события: ищется в аккаунте, затем в профиле роли — у каждой роли свой набор."
    sources = (
        account,
        account.customer_profile,
        account.expert_profile,
        account.license_holder_profile,
    )
    for source in sources:
        if source is not None and hasattr(source, preference_field):
            return bool(getattr(source, preference_field))
    return False

UNSUBSCRIBE_MARKER = "\nВы получили это письмо"
SIGNATURE = "—\nС уважением,\nкоманда «Ресурс-Плюс»\nplus-resurs.com"
SIGNATURE_LINES = {"—", "С уважением,", "команда «Ресурс-Плюс»"}


def keeps_in_telegram(line: str) -> bool:
    "Строка письма попадает в Telegram: без ссылок, почт и подписей — подпись добавляется одна, в конце."
    if "https://" in line or "@" in line or "plus-resurs.com" in line:
        return False
    return line.strip() not in SIGNATURE_LINES


def telegram_text(email_text: str, cta: str) -> str:
    "Текст письма (.txt-версия) → Telegram: без ссылок-переходов, с подсказкой открыть приложение."
    body = email_text.split(UNSUBSCRIBE_MARKER)[0]
    lines = [line for line in body.splitlines() if keeps_in_telegram(line)]
    text = re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip()
    first_line, _, rest = text.partition("\n")
    heading = f"<b>{html.escape(first_line)}</b>"
    body_part = f"{heading}\n{html.escape(rest.strip())}" if rest.strip() else heading
    return f"{body_part}\n\n{html.escape(cta)}\n\n{SIGNATURE}"


async def deliver_email_task(
    recipient_email: str,
    subject: str,
    text: str,
    html: str,
    from_email: str | None = None,
    reply_to: str | None = None,
) -> None:
    "BackgroundTasks-обёртка: отправка письма, ошибка SMTP только в лог."
    request_id = request_id_var.get()
    try:
        await send_email(recipient_email, subject, text, html, from_email=from_email, reply_to=reply_to)
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
        from_email: str | None = None,
        reply_to: str | None = None,
    ) -> None:
        "Публичный метод сервисного слоя."
        rendered = render_email(template_name, subject, context.model_dump())
        self.background_tasks.add_task(
            deliver_email_task,
            recipient_email=recipient_email,
            subject=rendered.subject,
            text=rendered.text,
            html=rendered.html,
            from_email=from_email,
            reply_to=reply_to,
        )

    def notify(
        self,
        account: Account | None,
        preference_field: str | None,
        template_name: str,
        subject: str,
        context: BaseModel,
        tg_cta: str,
        from_email: str | None = None,
        reply_to: str | None = None,
    ) -> None:
        "Одно событие — один текст: в Telegram уходит текст того же письма, что и на почту."
        if account is None:
            return
        rendered = render_email(template_name, subject, context.model_dump())
        self.send_telegram(account, None, telegram_text(rendered.text, tg_cta))
        if self.can_send(account, preference_field):
            self.dispatch(account.email, template_name, subject, context, from_email, reply_to)

    @staticmethod
    def can_send(account: Account | None, preference_field: str | None) -> bool:
        "Проверка: есть ли email у пользователя и включено ли именно это уведомление."
        if account is None:
            return False
        if not account.email:
            return False
        if preference_field is None:
            return True
        return preference_enabled(account, preference_field)

    def send_telegram(self, account: Account | None, preference_field: str | None, text: str) -> None:
        "TG-уведомление: если привязан Telegram, включены TG-уведомления и (если задан) тип уведомления."
        if account is None or not account.telegram_id:
            logger.info("TG пропущен: account=%s без telegram_id", getattr(account, "id", None))
            return
        if not account.notify_telegram_enabled:
            logger.info("TG пропущен: account=%s выключил Telegram-уведомления", account.id)
            return
        if preference_field and not preference_enabled(account, preference_field):
            logger.info("TG пропущен: account=%s выключен тумблер %s", account.id, preference_field)
            return
        logger.info("TG-уведомление в очереди: account=%s chat_id=%s", account.id, account.telegram_id)
        self.background_tasks.add_task(send_telegram_message, int(account.telegram_id), text)
