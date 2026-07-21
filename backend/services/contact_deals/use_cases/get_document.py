from services.contact_deals.contract import build_contract_pdf
from services.contact_deals.policies import ContactDealPolicy


class GetContactDealDocumentUseCase:
    def __init__(self, policy: ContactDealPolicy) -> None:
        self.policy = policy

    async def execute(self, deal_id: int, user_id: int) -> tuple[str, bytes]:
        deal = await self.policy.require_deal(deal_id)
        self.policy.require_participant(deal, user_id)
        pdf = build_contract_pdf(deal.contract_snapshot, deal.contract_hash, deal.signatures)
        return deal.public_id, pdf
