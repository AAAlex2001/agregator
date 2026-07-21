from datetime import UTC, datetime

from fastapi import HTTPException, UploadFile, status

from models.contact_deal import ContactAccessDeal, ContactDealStatus, ContactPaymentReceipt
from services.contact_deals.policies import ContactDealPolicy
from services.contact_deals.repository import ContactDealRepository
from services.contact_deals.storage import ContactReceiptStorage
from services.notifications import CreateContactAccessNotificationUseCase


class UploadContactReceiptUseCase:
    def __init__(
        self,
        repository: ContactDealRepository,
        policy: ContactDealPolicy,
        storage: ContactReceiptStorage,
        notification: CreateContactAccessNotificationUseCase | None = None,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.storage = storage
        self.notification = notification

    async def execute(
        self, deal_id: int, buyer_id: int, upload: UploadFile
    ) -> ContactAccessDeal:
        deal = await self.policy.require_deal(deal_id)
        self.policy.require_buyer(deal, buyer_id)
        self.policy.require_receipt_upload_status(deal)
        if len(deal.receipts) >= 5:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Достигнут лимит загрузок. Обратитесь в поддержку",
            )

        metadata = await self.storage.save(deal.public_id, upload)
        now = datetime.now(UTC)
        await self.repository.supersede_pending_receipts(deal.id, now)
        await self.repository.add_receipt(
            ContactPaymentReceipt(
                deal_id=deal.id,
                uploader_id=buyer_id,
                storage_key=str(metadata["storage_key"]),
                original_name=str(metadata["original_name"]),
                content_type=str(metadata["content_type"]),
                size_bytes=int(metadata["size_bytes"]),
                sha256=str(metadata["sha256"]),
            )
        )
        deal.status = ContactDealStatus.PAYMENT_REPORTED
        deal.buyer_reported_paid_at = now
        await self.repository.flush()
        if self.notification is not None:
            await self.notification.execute(
                deal.seller_id,
                "Покупатель загрузил чек",
                "Проверьте чек и подтвердите оплату, чтобы открыть контакты покупателю.",
            )
        return await self.policy.require_deal(deal.id)
