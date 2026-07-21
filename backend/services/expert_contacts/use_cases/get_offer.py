from fastapi import HTTPException, status

from schemas.expert_contact import ExpertContactOfferResponse
from services.contact_deals.crypto import ContactDealCipher
from services.expert_contacts.formatters import to_offer
from services.expert_contacts.repository import ExpertContactRepository


class GetExpertContactOfferUseCase:
    def __init__(
        self,
        repository: ExpertContactRepository,
        cipher: ContactDealCipher,
    ) -> None:
        self.repository = repository
        self.cipher = cipher

    async def execute(self, expert_id: int) -> ExpertContactOfferResponse:
        expert = await self.repository.get_active_expert(expert_id)
        if expert is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Настроить продажу контактов может только эксперт",
            )
        return to_offer(expert, self.cipher)
