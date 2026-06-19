"Use case: рассылка по базе компаний — пачкой непосланных или по диапазону позиций. В конце добиваем seed-адресами."

import logging

from services.campaigns.company_repository import CompanyRepository
from services.campaigns.seed_recipients import SEED_EMAILS
from utils.email import send_email
from utils.email_templates import render_email

logger = logging.getLogger(__name__)

TEMPLATE = "campaign_presentation"

# Письма уходят от имени expert@ и ответы получателей падают на этот же ящик.
CAMPAIGN_FROM_EMAIL = "expert@plus-resurs.com"


class SendBatchUseCase:
    "Шлёт письма со ссылкой на презентацию: либо следующую пачку непосланных, либо явный диапазон позиций базы. В конце добивает seed-адресами."

    def __init__(self, repo: CompanyRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        subject: str,
        body_text: str,
        presentation_url: str | None,
        batch_size: int,
        range_from: int | None = None,
        range_to: int | None = None,
    ) -> int:
        "Если задан диапазон range_from..range_to — шлём этим позициям; иначе следующую пачку непосланных. Возвращает число отправленных."
        if range_from is not None and range_to is not None:
            companies = await self.repo.take_range(range_from, range_to)
        else:
            companies = await self.repo.take_unsent_batch(batch_size)

        # Снимаем нужные поля и закрываем read-транзакцию ДО долгого цикла отправки
        # (иначе на тысячах писем соединение зависнет в idle-in-transaction).
        targets = [(c.id, c.email or "", c.name or "") for c in companies]
        await self.repo.db.commit()

        sent_ids: list[int] = []
        for company_id, email, name in targets:
            if await self.send_one(email, name, subject, body_text, presentation_url):
                sent_ids.append(company_id)

        await self.repo.mark_sent(sent_ids)
        await self.send_seed_copies(subject, body_text, presentation_url)
        logger.info("Mailing: processed, %d of %d companies sent", len(sent_ids), len(targets))
        return len(sent_ids)

    async def send_one(
        self, email: str, name: str, subject: str, body_text: str, presentation_url: str | None
    ) -> bool:
        "Шлёт письмо одной компании. True — успех (тогда компания помечается отправленной)."
        rendered = render_email(
            TEMPLATE,
            subject,
            {"company_name": name, "body_text": body_text, "presentation_url": presentation_url},
        )
        try:
            await send_email(
                email, rendered.subject, rendered.text, rendered.html,
                from_email=CAMPAIGN_FROM_EMAIL, reply_to=CAMPAIGN_FROM_EMAIL,
            )
            return True
        except Exception:
            logger.exception("Mailing send failed for %s", email)
            return False

    async def send_seed_copies(
        self, subject: str, body_text: str, presentation_url: str | None
    ) -> None:
        "Дописывает контрольные seed-адреса в конец рассылки — для самопроверки доставки."
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
