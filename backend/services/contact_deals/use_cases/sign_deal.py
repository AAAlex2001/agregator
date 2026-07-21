from fastapi import HTTPException, status

from models.contact_deal import (
    ContactAccessDeal,
    ContactDealParty,
    ContactDealSignature,
    ContactDealStatus,
    ContactSignatureMethod,
)
from services.contact_deals.contract import party_name
from services.contact_deals.policies import ContactDealPolicy
from services.contact_deals.repository import ContactDealRepository
from services.contact_deals.use_cases.notify_event import NotifyContactAccessEventUseCase
from utils.passwords import verify_password


class SignContactDealUseCase:
    def __init__(
        self,
        repository: ContactDealRepository,
        policy: ContactDealPolicy,
        notifier: NotifyContactAccessEventUseCase | None = None,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.notifier = notifier

    async def execute(
        self,
        deal_id: int,
        user_id: int,
        password: str,
        audit: dict[str, str | None],
    ) -> ContactAccessDeal:
        deal = await self.policy.require_deal(deal_id)
        party = self.policy.actor_party(deal, user_id)
        user = deal.seller if party == ContactDealParty.SELLER else deal.buyer

        if not await verify_password(password, user.password):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Неверный пароль")
        if any(signature.party == party for signature in deal.signatures):
            return deal
        self.validate_status(deal, party)

        signature = ContactDealSignature(
            deal_id=deal.id,
            signer_id=user.id,
            party=party,
            method=ContactSignatureMethod.PASSWORD,
            document_hash=deal.contract_hash,
            signer_name=party_name(user),
            ip_address=audit.get("ip_address"),
            user_agent=audit.get("user_agent"),
            session_id_hash=audit.get("session_id_hash"),
        )
        await self.repository.add_signature(signature)
        deal.status = (
            ContactDealStatus.AWAITING_SELLER_SIGNATURE
            if party == ContactDealParty.BUYER
            else ContactDealStatus.AWAITING_PAYMENT
        )
        await self.repository.flush()
        if self.notifier is not None:
            recipient_id = deal.seller_id if party == ContactDealParty.BUYER else deal.buyer_id
            title = (
                "Покупатель подписал договор"
                if party == ContactDealParty.BUYER
                else "Эксперт подписал договор"
            )
            message = (
                "Подпишите договор, чтобы покупатель получил реквизиты для прямой оплаты."
                if party == ContactDealParty.BUYER
                else "Договор подписан обеими сторонами. Реквизиты для оплаты доступны в сделке."
            )
            await self.notifier.execute(recipient_id, title, message)
        return await self.policy.require_deal(deal.id)

    @staticmethod
    def validate_status(deal: ContactAccessDeal, party: ContactDealParty) -> None:
        expected = (
            ContactDealStatus.AWAITING_SELLER_SIGNATURE
            if party == ContactDealParty.SELLER
            else ContactDealStatus.AWAITING_BUYER_SIGNATURE
        )
        if deal.status != expected:
            message = (
                "Сначала договор должен подписать покупатель"
                if party == ContactDealParty.SELLER
                else "Договор уже подписан покупателем"
            )
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=message)
