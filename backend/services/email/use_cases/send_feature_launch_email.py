"Use case: разовое письмо заказчикам или исполнителям о новых сервисах площадки."

import asyncio
import logging
from dataclasses import dataclass

from models.account import Account, UserRole
from schemas.email import FeatureLaunchEmailContext
from services.email.repository import EmailRepository
from utils.email import send_email
from utils.email_templates import render_email

logger = logging.getLogger(__name__)

FROM_EMAIL = "expert@plus-resurs.com"
CHUNK_SIZE = 50
CHUNK_PAUSE_SECONDS = 2


@dataclass(frozen=True)
class Letter:
    "Шаблон и тема письма для роли получателя."

    template: str
    subject: str


LETTERS = {
    UserRole.CUSTOMER: Letter(
        "feature_launch_customer",
        "Экспертиза и аудит СУПБ без поиска исполнителя — новое на «Ресурс-Плюс»",
    ),
    UserRole.EXPERT: Letter(
        "feature_launch_expert",
        "Новые заявки на ЭПБ и аудит СУПБ — уже в вашем кабинете",
    ),
}


class SendFeatureLaunchEmailUseCase:
    "Рассылает анонс по одному письму с паузами; сбой одного адреса не останавливает рассылку."

    def __init__(self, repo: EmailRepository, role: UserRole) -> None:
        self.repo = repo
        self.role = role
        self.letter = LETTERS[role]

    async def list_recipients(
        self, after_email: str | None = None, news_enabled: bool = True
    ) -> list[Account]:
        "Получатели роли по порядку email; after_email — продолжить после последнего отправленного."
        return await self.repo.list_announcement_recipients(self.role, after_email, news_enabled)

    async def execute(self, after_email: str | None = None, news_enabled: bool = True) -> int:
        "Отправляет всем получателям. Возвращает число успешно отправленных писем."
        recipients = await self.list_recipients(after_email, news_enabled)
        logger.info("Анонс сервисов (%s): получателей %d", self.role.value, len(recipients))
        sent = 0
        for index, account in enumerate(recipients, start=1):
            if await self.send(account.email or "", account.first_name or ""):
                sent += 1
            if index % CHUNK_SIZE == 0:
                logger.info(
                    "Анонс сервисов: %d/%d, последний адрес %s", index, len(recipients), account.email
                )
                await asyncio.sleep(CHUNK_PAUSE_SECONDS)
        logger.info("Анонс сервисов завершён: отправлено %d из %d", sent, len(recipients))
        return sent

    async def send(self, email: str, first_name: str) -> bool:
        "Отправляет одно письмо. False — ошибка доставки, она уже в логе."
        context = FeatureLaunchEmailContext(recipient_greeting=first_name.strip())
        rendered = render_email(self.letter.template, self.letter.subject, context.model_dump())
        try:
            await send_email(
                email,
                rendered.subject,
                rendered.text,
                rendered.html,
                from_email=FROM_EMAIL,
                reply_to=FROM_EMAIL,
            )
        except Exception:
            logger.exception("Анонс сервисов не доставлен на %s", email)
            return False
        return True
