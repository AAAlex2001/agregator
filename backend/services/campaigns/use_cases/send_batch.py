"Use case: рассылка по базе компаний — пачкой непосланных или по диапазону позиций. В конце добиваем seed-адресами."

import asyncio
import logging

from config import email_config
from services.campaigns.company_repository import CompanyRepository
from services.campaigns.seed_recipients import SEED_EMAILS
from utils.email import send_email
from utils.email_templates import render_email
from utils.signed_tokens import make_unsubscribe_token

logger = logging.getLogger(__name__)

TEMPLATE = "campaign_presentation"
CAMPAIGN_FROM_EMAIL = "expert@plus-resurs.com"


def unsubscribe_url(email: str) -> str:
    token = make_unsubscribe_token(email)
    base = email_config.public_base_url.rstrip("/")
    return f"{base}/api/email/unsubscribe?token={token}"


def list_unsubscribe_headers(url: str) -> dict[str, str]:
    return {
        "List-Unsubscribe": f"<{url}>, <mailto:{CAMPAIGN_FROM_EMAIL}?subject=unsubscribe>",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    }


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

        targets = [(c.id, c.email or "", c.name or "") for c in companies]
        await self.repo.db.commit()

        targets = await self.apply_daily_cap(targets)

        sent_ids: list[int] = []
        chunk = max(1, email_config.mailing_chunk_size)
        for start in range(0, len(targets), chunk):
            for company_id, email, name in targets[start:start + chunk]:
                if await self.send_one(email, name, subject, body_text, presentation_url):
                    sent_ids.append(company_id)
            if start + chunk < len(targets) and email_config.mailing_chunk_pause_seconds > 0:
                await asyncio.sleep(email_config.mailing_chunk_pause_seconds)

        await self.repo.mark_sent(sent_ids)
        await self.repo.db.commit()
        await self.send_seed_copies(subject, body_text, presentation_url)
        logger.info("Mailing: processed, %d of %d companies sent", len(sent_ids), len(targets))
        return len(sent_ids)

    async def apply_daily_cap(self, targets: list[tuple[int, str, str]]) -> list[tuple[int, str, str]]:
        "Обрезает список под дневной лимит прогрева (0 — без лимита). Об обрезке явно логируем."
        limit = email_config.mailing_daily_limit
        if limit <= 0:
            return targets
        already = await self.repo.sent_today_count()
        budget = max(0, limit - already)
        if len(targets) > budget:
            logger.warning(
                "Mailing: daily cap %d reached (sent today %d) — отправим %d из %d, остальное отложено",
                limit, already, budget, len(targets),
            )
            return targets[:budget]
        return targets

    async def send_one(
        self, email: str, name: str, subject: str, body_text: str, presentation_url: str | None
    ) -> bool:
        "Шлёт письмо одной компании. True — успех (тогда компания помечается отправленной)."
        unsub = unsubscribe_url(email)
        rendered = render_email(
            TEMPLATE,
            subject,
            {
                "company_name": name,
                "body_text": body_text,
                "presentation_url": presentation_url,
                "unsubscribe_url": unsub,
            },
        )
        try:
            await send_email(
                email, rendered.subject, rendered.text, rendered.html,
                from_email=CAMPAIGN_FROM_EMAIL, reply_to=CAMPAIGN_FROM_EMAIL,
                headers=list_unsubscribe_headers(unsub),
            )
            return True
        except Exception:
            logger.exception("Mailing send failed for %s", email)
            return False

    async def send_seed_copies(
        self, subject: str, body_text: str, presentation_url: str | None
    ) -> None:
        "Дописывает контрольные seed-адреса в конец рассылки — для самопроверки доставки."
        for email in SEED_EMAILS:
            unsub = unsubscribe_url(email)
            rendered = render_email(
                TEMPLATE,
                subject,
                {
                    "company_name": "",
                    "body_text": body_text,
                    "presentation_url": presentation_url,
                    "unsubscribe_url": unsub,
                },
            )
            try:
                await send_email(
                    email, rendered.subject, rendered.text, rendered.html,
                    from_email=CAMPAIGN_FROM_EMAIL, reply_to=CAMPAIGN_FROM_EMAIL,
                    headers=list_unsubscribe_headers(unsub),
                )
            except Exception:
                logger.exception("Seed copy failed for %s", email)
