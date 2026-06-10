"Use case: отправка одной пачки писем рассылки по базе компаний. В конце пачки добиваем seed-адресами."

import logging

from models.company import Company
from services.campaigns.company_repository import CompanyRepository
from services.campaigns.seed_recipients import SEED_EMAILS
from utils.email import send_email
from utils.email_templates import render_email

logger = logging.getLogger(__name__)

TEMPLATE = "campaign_presentation"

# Письма уходят от имени expert@ и ответы получателей падают на этот же ящик.
CAMPAIGN_FROM_EMAIL = "expert@plus-resurs.com"


class SendBatchUseCase:
    "Берёт пачку компаний из базы (которым ещё не слали), шлёт письма со ссылкой на презентацию, в конце добивает seed-адресами."

    def __init__(self, repo: CompanyRepository) -> None:
        self.repo = repo

    async def execute(
        self, subject: str, body_text: str, presentation_url: str | None, batch_size: int
    ) -> int:
        "Обрабатывает одну пачку. Возвращает число компаний, которым ушло письмо."
        companies = await self.repo.take_unsent_batch(batch_size)

        sent_ids: list[int] = []
        for company in companies:
            if await self.send_one(company, subject, body_text, presentation_url):
                sent_ids.append(company.id)  # noqa: PERF401 — отправка с побочным эффектом, не трансформация

        await self.repo.mark_sent(sent_ids)
        await self.send_seed_copies(subject, body_text, presentation_url)
        logger.info("Mailing: batch processed, %d of %d companies sent", len(sent_ids), len(companies))
        return len(sent_ids)

    async def send_one(
        self, company: Company, subject: str, body_text: str, presentation_url: str | None
    ) -> bool:
        "Шлёт письмо одной компании. True — успех (тогда компания помечается отправленной)."
        rendered = render_email(
            TEMPLATE,
            subject,
            {
                "company_name": company.name or "",
                "body_text": body_text,
                "presentation_url": presentation_url,
            },
        )
        try:
            await send_email(
                company.email or "", rendered.subject, rendered.text, rendered.html,
                from_email=CAMPAIGN_FROM_EMAIL, reply_to=CAMPAIGN_FROM_EMAIL,
            )
            return True
        except Exception:
            logger.exception("Mailing send failed for %s", company.email)
            return False

    async def send_seed_copies(
        self, subject: str, body_text: str, presentation_url: str | None
    ) -> None:
        "Дописывает контрольные seed-адреса в конец пачки — для самопроверки доставки."
        rendered = render_email(
            TEMPLATE,
            subject,
            {"company_name": "", "body_text": body_text, "presentation_url": presentation_url},
        )
        for email in SEED_EMAILS:
            try:
                await send_email(
                    email, rendered.subject, rendered.text, rendered.html,
                    from_email=CAMPAIGN_FROM_EMAIL, reply_to=CAMPAIGN_FROM_EMAIL,
                )
            except Exception:
                logger.exception("Seed copy failed for %s", email)
