from fastapi import HTTPException, status

from models.chat import Chat
from models.labor import LaborListingKind
from schemas.labor import LaborContactResponse
from services.email import SendLaborResponseEmailUseCase
from services.labor_resources.formatters import display_name
from services.labor_resources.policies import LaborPolicy
from services.labor_resources.repository import LaborRepository
from services.notifications import CreateLaborResponseNotificationUseCase


class ContactLaborListingUseCase:
    def __init__(
        self,
        repository: LaborRepository,
        policy: LaborPolicy,
        notification: CreateLaborResponseNotificationUseCase,
        send_email: SendLaborResponseEmailUseCase,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.notification = notification
        self.send_email = send_email

    async def execute(
        self,
        listing_id: int,
        actor_id: int,
    ) -> LaborContactResponse:
        actor = await self.policy.require_user(actor_id)
        listing = await self.repository.get_by_id(
            listing_id,
            active_only=True,
            for_update=True,
        )
        if listing is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заявка не найдена",
            )
        if listing.owner_id == actor_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Нельзя откликнуться на свою заявку",
            )

        if listing.kind == LaborListingKind.EXPERT_WANTED:
            customer_id, expert_id = listing.owner_id, actor_id
        else:
            customer_id, expert_id = actor_id, listing.owner_id

        chat = await self.repository.find_chat(
            listing.id,
            customer_id,
            expert_id,
        )
        if chat is None:
            chat = Chat(
                labor_listing_id=listing.id,
                customer_id=customer_id,
                expert_id=expert_id,
                labor_response_is_read=False,
            )
            await self.repository.add(chat)
            await self.repository.flush()
            expert_wanted = listing.kind == LaborListingKind.EXPERT_WANTED
            listing_title = (
                "Поиск эксперта в штат"
                if expert_wanted
                else "Готов к трудовому договору"
            )
            action_url = (
                "/labor/expert-search?tab=mine"
                if expert_wanted
                else "/labor/employment?tab=mine"
            )
            await self.notification.execute(
                listing.owner_id,
                display_name(actor),
                listing_title,
                action_url,
            )
            await self.send_email.execute(listing.id, actor_id)
        return LaborContactResponse(chat_uuid=str(chat.uuid))
