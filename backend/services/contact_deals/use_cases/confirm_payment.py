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


class ConfirmContactPaymentUseCase:
    def __init__(
        self,
        repository: ContactDealRepository,
        policy: ContactDealPolicy,
        notifier: NotifyContactAccessEventUseCase | None = None,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.notifier = notifier

    async def execute(self, deal_id: int, seller_id: int) -> ContactAccessDeal:
        deal = await self.policy.require_deal(deal_id)
        self.policy.require_seller(deal, seller_id)
        receipt = self.policy.pending_receipt(deal)
        if deal.status != ContactDealStatus.PAYMENT_REPORTED or receipt is None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Нет чека на подтверждении")

        now = datetime.now(UTC)
        receipt.status = ContactReceiptStatus.APPROVED
        receipt.reviewed_at = now
        deal.seller_confirmed_at = now
        release_contacts(
            deal,
            ContactDealReleaseActor.SELLER,
            "Оплата подтверждена экспертом",
            now,
        )
        await self.repository.flush()
        if self.notifier is not None:
            await self.notifier.execute(
                deal.buyer_id,
                "Оплата подтверждена",
                "Эксперт подтвердил оплату. Телефон и email открыты в сделке.",
            )
        return await self.policy.require_deal(deal.id)
