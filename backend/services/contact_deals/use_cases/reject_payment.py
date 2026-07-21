from datetime import UTC, datetime

from fastapi import HTTPException, status

from models.contact_deal import ContactAccessDeal, ContactDealStatus, ContactReceiptStatus
from services.contact_deals.policies import ContactDealPolicy
from services.contact_deals.repository import ContactDealRepository
from services.notifications import CreateContactAccessNotificationUseCase


class RejectContactPaymentUseCase:
    def __init__(
        self,
        repository: ContactDealRepository,
        policy: ContactDealPolicy,
        notification: CreateContactAccessNotificationUseCase | None = None,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.notification = notification

    async def execute(
        self, deal_id: int, seller_id: int, reason: str
    ) -> ContactAccessDeal:
        deal = await self.policy.require_deal(deal_id)
        self.policy.require_seller(deal, seller_id)
        receipt = self.policy.pending_receipt(deal)
        if deal.status != ContactDealStatus.PAYMENT_REPORTED or receipt is None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Нет чека на подтверждении")

        receipt.status = ContactReceiptStatus.REJECTED
        receipt.rejection_reason = reason.strip()
        receipt.reviewed_at = datetime.now(UTC)
        deal.status = ContactDealStatus.PAYMENT_REJECTED
        await self.repository.flush()
        if self.notification is not None:
            await self.notification.execute(
                deal.buyer_id,
                "Чек отклонён экспертом",
                f"Причина: {reason.strip()}. Проверьте оплату и загрузите новый чек.",
            )
        return await self.policy.require_deal(deal.id)
