"Use case: разовое письмо исполнителям о запуске реферальной программы."

import asyncio
import logging

from models.account import Account
from schemas.email import ReferralLaunchEmailContext
from services.email.formatting import format_pluses
from services.email.repository import EmailRepository
from services.email.unsubscribe import list_unsubscribe_headers, unsubscribe_url
from utils.email import send_email
from utils.email_templates import render_email

logger = logging.getLogger(__name__)

TEMPLATE = "referral_launch"
SUBJECT = "Приглашайте коллег на «Ресурс-Плюс» — {reward} за каждого"
FROM_EMAIL = "expert@plus-resurs.com"
CTA_URL = "https://plus-resurs.com/settings"
CHUNK_SIZE = 50
CHUNK_PAUSE_SECONDS = 2


class SendReferralLaunchEmailUseCase:
    "Рассылает анонс по одному письму с паузами; сбой одного адреса не останавливает рассылку."

    def __init__(self, repo: EmailRepository, reward_points: int, pool_points: int) -> None:
        self.repo = repo
        self.reward = format_pluses(reward_points)
        self.pool = format_pluses(pool_points)

    async def list_recipients(self, after_email: str | None = None) -> list[Account]:
        "Получатели по порядку email; after_email — продолжить после последнего отправленного."
        return await self.repo.list_experts_for_announcement(after_email)

    async def execute(self, after_email: str | None = None) -> int:
        "Отправляет всем получателям. Возвращает число успешно отправленных писем."
        recipients = await self.list_recipients(after_email)
        logger.info("Анонс рефералки: получателей %d", len(recipients))
        sent = 0
        for index, account in enumerate(recipients, start=1):
            if await self.send(account.email or "", account.first_name or ""):
                sent += 1
            if index % CHUNK_SIZE == 0:
                logger.info(
                    "Анонс рефералки: %d/%d, последний адрес %s", index, len(recipients), account.email
                )
                await asyncio.sleep(CHUNK_PAUSE_SECONDS)
        logger.info("Анонс рефералки завершён: отправлено %d из %d", sent, len(recipients))
        return sent

    async def send(self, email: str, first_name: str) -> bool:
        "Отправляет одно письмо со ссылкой отписки. False — ошибка доставки, она уже в логе."
        unsubscribe = unsubscribe_url(email)
        context = ReferralLaunchEmailContext(
            recipient_greeting=first_name.strip(),
            reward=self.reward,
            pool=self.pool,
            steps=[
                "Откройте «Настройки профиля» и скопируйте свою ссылку для приглашения.",
                "Отправьте её коллегам-исполнителям: экспертам, проектировщикам, изыскателям, лабораториям.",
                f"Коллега регистрируется по ссылке, подтверждает почту, указывает имя и заполняет "
                f"хотя бы одно направление — и вам автоматически начисляется {self.reward}.",
            ],
            cta_url=CTA_URL,
            unsubscribe_url=unsubscribe,
        )
        rendered = render_email(TEMPLATE, SUBJECT.format(reward=self.reward), context.model_dump())
        try:
            await send_email(
                email,
                rendered.subject,
                rendered.text,
                rendered.html,
                from_email=FROM_EMAIL,
                reply_to=FROM_EMAIL,
                headers=list_unsubscribe_headers(unsubscribe, FROM_EMAIL),
            )
        except Exception:
            logger.exception("Анонс рефералки не доставлен на %s", email)
            return False
        return True
