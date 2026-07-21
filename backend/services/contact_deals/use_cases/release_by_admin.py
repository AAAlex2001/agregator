from datetime import UTC, datetime

from fastapi import HTTPException, status

from models.contact_deal import (
    ContactAccessDeal,
    ContactDealReleaseActor,
    ContactDealStatus,
    ContactReceiptStatus,
)
from services.contact_deals.policies import ContactDealPolicy, release_contacts
from services.contact_deals.repository import ContactDealRepository
from services.contact_deals.use_cases.notify_event import NotifyContactAccessEventUseCase


class ReleaseContactByAdminUseCase:
    def __init__(
        self,
        repository: ContactDealRepository,
        policy: ContactDealPolicy,
        notifier: NotifyContactAccessEventUseCase | None = None,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.notifier = notifier

    async def execute(self, deal_id: int, note: str) -> ContactAccessDeal:
        deal = await self.policy.require_deal(deal_id)
        if deal.status == ContactDealStatus.CONTACTS_RELEASED:
            return deal
        receipt = self.policy.latest_reviewable_receipt(deal)
        if receipt is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Контакты нельзя выдать без загруженного чека",
            )

        now = datetime.now(UTC)
        receipt.status = ContactReceiptStatus.APPROVED
        receipt.reviewed_at = now
        release_contacts(deal, ContactDealReleaseActor.ADMIN, note.strip(), now)
        await self.repository.flush()
        if self.notifier is not None:
            await self.notifier.execute(
                deal.buyer_id,
                "Контакты открыты администратором",
                "Чек проверен администрацией. Телефон и email эксперта доступны в сделке.",
            )
        return await self.policy.require_deal(deal.id)
