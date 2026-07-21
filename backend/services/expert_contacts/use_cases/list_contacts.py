from schemas.expert_contact import ExpertContactListResponse
from services.contact_deals.crypto import ContactDealCipher
from services.expert_contacts.formatters import to_expert_contact
from services.expert_contacts.repository import ExpertContactRepository


class ListExpertContactsUseCase:
    def __init__(
        self,
        repository: ExpertContactRepository,
        cipher: ContactDealCipher,
    ) -> None:
        self.repository = repository
        self.cipher = cipher

    async def execute(
        self,
        actor_id: int,
        search: str | None,
        limit: int,
        offset: int,
    ) -> ExpertContactListResponse:
        rows, total = await self.repository.list_experts(actor_id, search, limit, offset)
        items = [
            to_expert_contact(expert, deal, actor_id, self.cipher)
            for expert, deal in rows
        ]
        return ExpertContactListResponse(items=items, total=total)
