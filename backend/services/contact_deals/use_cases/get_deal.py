from schemas.contact_deal import ContactDealDetailResponse
from services.contact_deals.crypto import ContactDealCipher
from services.contact_deals.formatters import to_detail
from services.contact_deals.policies import ContactDealPolicy


class GetContactDealUseCase:
    def __init__(self, policy: ContactDealPolicy, cipher: ContactDealCipher) -> None:
        self.policy = policy
        self.cipher = cipher

    async def execute(
        self, deal_id: int, user_id: int | None, admin: bool = False
    ) -> ContactDealDetailResponse:
        deal = await self.policy.require_deal(deal_id)
        if not admin and user_id is not None:
            self.policy.require_participant(deal, user_id)
        return to_detail(deal, user_id, self.cipher, admin=admin)
