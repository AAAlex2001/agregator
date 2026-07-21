from datetime import UTC, datetime
from uuid import uuid4

from fastapi import HTTPException, status

from models.contact_deal import ContactAccessDeal, ContactDealStatus
from services.contact_deals.contract import build_contract_snapshot, contract_hash
from services.contact_deals.crypto import ContactDealCipher
from services.contact_deals.policies import ContactDealPolicy
from services.contact_deals.repository import ContactDealRepository


class CreateContactDealUseCase:
    def __init__(
        self,
        repository: ContactDealRepository,
        policy: ContactDealPolicy,
        cipher: ContactDealCipher,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.cipher = cipher

    async def execute(self, seller_id: int, buyer_id: int) -> ContactAccessDeal:
        existing = await self.repository.find_for_seller_and_buyer(seller_id, buyer_id)
        if existing is not None:
            return existing

        buyer = await self.policy.require_user(buyer_id)
        seller = await self.policy.require_expert(seller_id)
        if seller.id == buyer.id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Нельзя купить свои контакты")
        if (
            not seller.contact_sales_enabled
            or not seller.contact_price_kopecks
            or not seller.contact_payment_details_encrypted
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Эксперт не включил платный доступ к контактам",
            )

        public_id = str(uuid4())
        snapshot = build_contract_snapshot(
            public_id=public_id,
            contract_date=datetime.now(UTC).date(),
            seller=seller,
            buyer=buyer,
            price_kopecks=seller.contact_price_kopecks,
        )
        deal = ContactAccessDeal(
            public_id=public_id,
            seller_id=seller.id,
            buyer_id=buyer.id,
            status=ContactDealStatus.AWAITING_BUYER_SIGNATURE,
            price_kopecks=seller.contact_price_kopecks,
            payment_details_encrypted=seller.contact_payment_details_encrypted,
            seller_contacts_encrypted=self.cipher.encrypt_json(
                {"phone": seller.phone, "email": seller.email}
            ),
            contract_snapshot=snapshot,
            contract_hash=contract_hash(snapshot),
        )
        await self.repository.add_deal(deal)
        await self.repository.flush()
        return await self.policy.require_deal(deal.id)
