"Repository: доступ к БД для email-кампаний, получателей и стоп-листа."

from datetime import UTC, datetime

from sqlalchemy import func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from models.campaign import (
    CampaignRecipient,
    CampaignStatus,
    EmailCampaign,
    EmailSuppression,
    RecipientStatus,
    SuppressionReason,
)


class CampaignRepository:
    "Все обращения к БД по кампаниям, получателям и стоп-листу."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_campaign(self, name: str, subject: str, batch_size: int) -> EmailCampaign:
        "Создаёт новую кампанию в статусе DRAFT."
        campaign = EmailCampaign(name=name, subject=subject, batch_size=batch_size)
        self.db.add(campaign)
        await self.db.flush()
        return campaign

    async def get_campaign(self, campaign_id: int) -> EmailCampaign | None:
        "Возвращает кампанию по id."
        return (
            await self.db.execute(select(EmailCampaign).where(EmailCampaign.id == campaign_id))
        ).scalars().first()

    async def set_presentation_path(self, campaign_id: int, path: str | None) -> None:
        "Сохраняет путь к PDF-презентации кампании."
        await self.db.execute(
            update(EmailCampaign).where(EmailCampaign.id == campaign_id).values(presentation_path=path)
        )

    async def bulk_add_recipients(self, rows: list[dict[str, object]]) -> None:
        "Массовая вставка получателей одним INSERT. Дубли внутри пачки должны быть отсеяны вызывающим."
        if not rows:
            return
        await self.db.execute(insert(CampaignRecipient), rows)

    async def set_status(self, campaign_id: int, status: CampaignStatus) -> None:
        "Меняет статус кампании, проставляет started_at/finished_at по необходимости."
        values: dict[str, object] = {"status": status}
        if status is CampaignStatus.RUNNING:
            values["started_at"] = datetime.now(UTC)
        if status in (CampaignStatus.DONE, CampaignStatus.FAILED):
            values["finished_at"] = datetime.now(UTC)
        await self.db.execute(
            update(EmailCampaign).where(EmailCampaign.id == campaign_id).values(**values)
        )

    async def list_running_campaigns(self) -> list[EmailCampaign]:
        "Все кампании в статусе RUNNING — их обрабатывает воркер."
        return list(
            (await self.db.execute(
                select(EmailCampaign).where(EmailCampaign.status == CampaignStatus.RUNNING)
            )).scalars().all()
        )

    async def add_recipient(
        self, campaign_id: int, company_name: str, inn: str | None, email: str, is_seed: bool
    ) -> None:
        "Добавляет получателя в сессию (без flush — батч коммитится вызывающим)."
        self.db.add(
            CampaignRecipient(
                campaign_id=campaign_id,
                company_name=company_name,
                inn=inn,
                email=email,
                is_seed=is_seed,
            )
        )

    async def existing_emails(self, campaign_id: int) -> set[str]:
        "Уже добавленные в кампанию адреса — для дедупликации при импорте."
        rows = await self.db.execute(
            select(CampaignRecipient.email).where(CampaignRecipient.campaign_id == campaign_id)
        )
        return {row[0] for row in rows}

    async def take_pending_batch(self, campaign_id: int, limit: int) -> list[CampaignRecipient]:
        "Берёт пачку PENDING-получателей с блокировкой строк (FOR UPDATE SKIP LOCKED) — защита от гонок при нескольких воркерах."
        stmt = (
            select(CampaignRecipient)
            .where(
                CampaignRecipient.campaign_id == campaign_id,
                CampaignRecipient.status == RecipientStatus.PENDING,
                CampaignRecipient.is_seed.is_(False),
            )
            .order_by(CampaignRecipient.id)
            .limit(limit)
            .with_for_update(skip_locked=True)
        )
        return list((await self.db.execute(stmt)).scalars().all())

    async def mark_recipient(
        self, recipient_id: int, status: RecipientStatus, error: str | None = None
    ) -> None:
        "Проставляет результат отправки одному получателю."
        await self.db.execute(
            update(CampaignRecipient)
            .where(CampaignRecipient.id == recipient_id)
            .values(status=status, error=error, sent_at=datetime.now(UTC))
        )

    async def count_by_status(self, campaign_id: int) -> dict[str, int]:
        "Счётчики получателей по статусам для дашборда кампании."
        rows = await self.db.execute(
            select(CampaignRecipient.status, func.count())
            .where(CampaignRecipient.campaign_id == campaign_id)
            .group_by(CampaignRecipient.status)
        )
        return {status.value: int(count) for status, count in rows}

    async def pending_count(self, campaign_id: int) -> int:
        "Сколько ещё непосланных (не считая seed)."
        stmt = select(func.count()).where(
            CampaignRecipient.campaign_id == campaign_id,
            CampaignRecipient.status == RecipientStatus.PENDING,
            CampaignRecipient.is_seed.is_(False),
        )
        return int((await self.db.execute(stmt)).scalar_one() or 0)

    async def suppressed_emails(self) -> set[str]:
        "Весь стоп-лист (отписки/баунсы/жалобы) — нельзя слать."
        rows = await self.db.execute(select(EmailSuppression.email))
        return {row[0] for row in rows}

    async def is_suppressed(self, email: str) -> bool:
        "Проверка одного адреса по стоп-листу."
        stmt = select(EmailSuppression.id).where(EmailSuppression.email == email)
        return (await self.db.execute(stmt)).first() is not None

    async def add_suppression(self, email: str, reason: SuppressionReason) -> None:
        "Добавляет адрес в стоп-лист, игнорируя дубль."
        if await self.is_suppressed(email):
            return
        self.db.add(EmailSuppression(email=email, reason=reason))
        await self.db.flush()
