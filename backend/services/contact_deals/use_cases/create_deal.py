from datetime import UTC, datetime
from uuid import uuid4

from fastapi import HTTPException, status

from models.contact_deal import ContactAccessDeal, ContactDealStatus
from services.contact_deals.contract import build_contract_snapshot, contract_hash, party_name
from services.contact_deals.crypto import ContactDealCipher
from services.contact_deals.policies import ContactDealPolicy
from services.contact_deals.repository import ContactDealRepository
from services.contact_deals.use_cases.notify_event import NotifyContactAccessEventUseCase


class CreateContactDealUseCase:
    def __init__(
        self,
        repository: ContactDealRepository,
        policy: ContactDealPolicy,
        cipher: ContactDealCipher,
        notifier: NotifyContactAccessEventUseCase | None = None,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.cipher = cipher
        self.notifier = notifier

    async def execute(self, seller_id: int, buyer_id: int) -> ContactAccessDeal:
        existing = await self.repository.find_for_seller_and_buyer(
            seller_id,
            buyer_id,
            for_update=True,
        )
        if existing is not None:
            if existing.buyer_deleted_at is not None:
                existing.buyer_deleted_at = None
                await self.repository.flush()
                if self.notifier is not None:
                    await self.notifier.execute(
                        existing.seller_id,
                        "Покупатель вернулся к заявке на контакты",
                        (
                            "Ранее скрытая покупателем сделка снова активна. "
                            "Продолжить оформление можно в разделе контактов экспертов."
                        ),
                    )
            return existing

        seller = await self.policy.require_expert(seller_id, for_update=True)
        existing = await self.repository.find_for_seller_and_buyer(
            seller_id,
            buyer_id,
        )
        if existing is not None:
            return existing

        buyer = await self.policy.require_user(buyer_id)
        if seller.id == buyer.id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Нельзя купить свои контакты")
        profile = seller.expert_profile
        if (
            not profile.contact_sales_enabled
            or not profile.contact_price_kopecks
            or not profile.contact_payment_details_encrypted
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
            price_kopecks=profile.contact_price_kopecks,
        )
        deal = ContactAccessDeal(
            public_id=public_id,
            seller_id=seller.id,
            buyer_id=buyer.id,
            status=ContactDealStatus.AWAITING_BUYER_SIGNATURE,
            price_kopecks=profile.contact_price_kopecks,
            payment_details_encrypted=profile.contact_payment_details_encrypted,
            seller_contacts_encrypted=self.cipher.encrypt_json(
                {"phone": seller.phone, "email": seller.email}
            ),
            contract_snapshot=snapshot,
            contract_hash=contract_hash(snapshot),
        )
        await self.repository.add_deal(deal)
        await self.repository.flush()
        if self.notifier is not None:
            await self.notifier.execute(
                seller.id,
                "Новый запрос на ваши контакты",
                (
                    f"{party_name(buyer)} начал оформление доступа к вашим контактам. "
                    "После подписи покупателя вы получите отдельное уведомление."
                ),
            )
        return await self.policy.require_deal(deal.id)
