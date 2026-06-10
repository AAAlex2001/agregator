"Use case: отправка одной пачки писем кампании. Seed-адреса дописываются в конец КАЖДОЙ пачки."

import logging
from pathlib import Path

from models.campaign import CampaignRecipient, RecipientStatus
from services.campaigns.repository import CampaignRepository
from services.campaigns.seed_recipients import SEED_EMAILS
from utils.email import EmailAttachment, send_email
from utils.email_templates import render_email

logger = logging.getLogger(__name__)

TEMPLATE = "campaign_presentation"
UNSUBSCRIBE_BASE = "https://plus-resurs.com/api/unsubscribe"
PRESENTATION_FILENAME = "Презентация Ресурс-Плюс.pdf"

# Письма кампании уходят от имени expert@ и ответы получателей падают на этот же ящик.
CAMPAIGN_FROM_EMAIL = "expert@plus-resurs.com"


class SendBatchUseCase:
    "Берёт пачку PENDING-получателей, шлёт письма (с PDF-презентацией во вложении), в конце пачки добивает seed-адресами."

    def __init__(self, repo: CampaignRepository) -> None:
        self.repo = repo

    async def execute(
        self, campaign_id: int, subject: str, batch_size: int, presentation_path: str | None
    ) -> int:
        "Обрабатывает одну пачку. Возвращает число реальных (не seed) получателей в пачке."
        batch = await self.repo.take_pending_batch(campaign_id, batch_size)
        if not batch:
            return 0

        attachments = self.build_attachments(presentation_path)
        for recipient in batch:
            await self.send_one(recipient, subject, attachments)

        await self.send_seed_copies(subject, attachments)
        await self.repo.db.flush()
        logger.info("Campaign %d: processed batch of %d recipients", campaign_id, len(batch))
        return len(batch)

    @staticmethod
    def build_attachments(presentation_path: str | None) -> list[EmailAttachment]:
        "Готовит вложение с PDF-презентацией, если файл задан и существует на диске."
        if not presentation_path:
            return []
        path = Path(presentation_path)
        if not path.exists() or not path.is_file():
            logger.warning("Presentation file not found: %s", presentation_path)
            return []
        return [EmailAttachment(path=path, filename=PRESENTATION_FILENAME)]

    async def send_one(
        self, recipient: CampaignRecipient, subject: str, attachments: list[EmailAttachment]
    ) -> None:
        "Шлёт письмо одному получателю с вложением и фиксирует результат в БД."
        rendered = render_email(
            TEMPLATE,
            subject,
            {
                "company_name": recipient.company_name or "",
                "has_presentation": bool(attachments),
                "unsubscribe_url": f"{UNSUBSCRIBE_BASE}?email={recipient.email}",
            },
        )
        try:
            await send_email(
                recipient.email, rendered.subject, rendered.text, rendered.html, attachments,
                from_email=CAMPAIGN_FROM_EMAIL, reply_to=CAMPAIGN_FROM_EMAIL,
            )
            await self.repo.mark_recipient(recipient.id, RecipientStatus.SENT)
        except Exception as exc:
            logger.exception("Campaign send failed for %s", recipient.email)
            await self.repo.mark_recipient(recipient.id, RecipientStatus.FAILED, error=str(exc))

    async def send_seed_copies(self, subject: str, attachments: list[EmailAttachment]) -> None:
        "Дописывает контрольные seed-адреса в конец пачки. Результат в БД не пишем — это служебные копии."
        rendered = render_email(
            TEMPLATE,
            subject,
            {"company_name": "", "has_presentation": bool(attachments), "unsubscribe_url": f"{UNSUBSCRIBE_BASE}?email="},
        )
        for email in SEED_EMAILS:
            try:
                await send_email(
                    email, rendered.subject, rendered.text, rendered.html, attachments,
                    from_email=CAMPAIGN_FROM_EMAIL, reply_to=CAMPAIGN_FROM_EMAIL,
                )
            except Exception:
                logger.exception("Seed copy failed for %s", email)
