from datetime import datetime

from fastapi import HTTPException, status

from models.contact_deal import (
    ContactAccessDeal,
    ContactDealParty,
    ContactDealReleaseActor,
    ContactDealStatus,
    ContactPaymentReceipt,
    ContactReceiptStatus,
)
from models.user import User
from services.contact_deals.repository import ContactDealRepository


class ContactDealPolicy:
    def __init__(self, repository: ContactDealRepository) -> None:
        self.repository = repository

    async def require_deal(self, deal_id: int) -> ContactAccessDeal:
        deal = await self.repository.get(deal_id)
        if deal is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Сделка не найдена")
        return deal

    async def require_user(self, user_id: int) -> User:
        user = await self.repository.get_user(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")
        return user

    async def require_expert(self, user_id: int) -> User:
        expert = await self.repository.get_active_expert(user_id)
        if expert is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Эксперт не найден")
        return expert

    @staticmethod
    def require_participant(deal: ContactAccessDeal, user_id: int) -> None:
        if user_id not in {deal.seller_id, deal.buyer_id}:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа к сделке")

    @staticmethod
    def actor_party(deal: ContactAccessDeal, user_id: int) -> ContactDealParty:
        ContactDealPolicy.require_participant(deal, user_id)
        return ContactDealParty.SELLER if user_id == deal.seller_id else ContactDealParty.BUYER

    @staticmethod
    def require_buyer(deal: ContactAccessDeal, user_id: int) -> None:
        if deal.buyer_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа к сделке")

    @staticmethod
    def require_seller(deal: ContactAccessDeal, user_id: int) -> None:
        if deal.seller_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа к сделке")

    @staticmethod
    def pending_receipt(deal: ContactAccessDeal) -> ContactPaymentReceipt | None:
        return next(
            (receipt for receipt in deal.receipts if receipt.status == ContactReceiptStatus.PENDING),
            None,
        )

    @staticmethod
    def latest_reviewable_receipt(deal: ContactAccessDeal) -> ContactPaymentReceipt | None:
        receipts = [
            receipt
            for receipt in deal.receipts
            if receipt.status in {ContactReceiptStatus.PENDING, ContactReceiptStatus.REJECTED}
        ]
        return max(receipts, key=lambda receipt: receipt.created_at, default=None)

    @staticmethod
    def require_receipt_upload_status(deal: ContactAccessDeal) -> None:
        if deal.status not in {
            ContactDealStatus.AWAITING_PAYMENT,
            ContactDealStatus.PAYMENT_REJECTED,
        }:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Чек можно загрузить после подписания договора обеими сторонами",
            )


def release_contacts(
    deal: ContactAccessDeal,
    actor: ContactDealReleaseActor,
    note: str,
    released_at: datetime,
) -> None:
    deal.status = ContactDealStatus.CONTACTS_RELEASED
    deal.released_at = released_at
    deal.released_by = actor
    deal.release_note = note
