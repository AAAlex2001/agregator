from fastapi import HTTPException, status

from models.contact_deal import ContactPaymentReceipt
from services.contact_deals.policies import ContactDealPolicy


class GetContactReceiptUseCase:
    def __init__(self, policy: ContactDealPolicy) -> None:
        self.policy = policy

    async def execute(
        self, deal_id: int, receipt_id: int, user_id: int | None
    ) -> ContactPaymentReceipt:
        deal = await self.policy.require_deal(deal_id)
        if user_id is not None:
            self.policy.require_participant(deal, user_id)
        receipt = next((item for item in deal.receipts if item.id == receipt_id), None)
        if receipt is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Чек не найден")
        return receipt
