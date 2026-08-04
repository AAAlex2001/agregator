from models.labor import LaborListingKind
from schemas.email import LaborResponseContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import full_name, greeting_for, labor_listing_title
from services.email.repository import EmailRepository

TEMPLATE = "labor_response"
PREFERENCE_FIELD = "email_on_labor_listing"
SUBJECT = "Новый отклик на вашу заявку — Ресурс-Плюс"
TG_CTA = "Чтобы открыть отклик, перейдите в раздел трудовых ресурсов."


class SendLaborResponseEmailUseCase:
    def __init__(
        self,
        repository: EmailRepository,
        dispatcher: EmailDispatcher,
    ) -> None:
        self.repository = repository
        self.dispatcher = dispatcher

    async def execute(
        self,
        listing_id: int,
        responder_id: int,
    ) -> None:
        listing = await self.repository.find_labor_listing(listing_id)
        responder = await self.repository.find_user(responder_id)
        if listing is None or responder is None:
            return

        recipient = listing.owner
        expert_wanted = listing.kind == LaborListingKind.EXPERT_WANTED
        context = LaborResponseContext(
            recipient_greeting=greeting_for(recipient),
            responder_name=full_name(responder) or responder.email,
            listing_title=labor_listing_title(listing.kind),
            cta_url=(
                "https://plus-resurs.com/labor/expert-search?tab=mine"
                if expert_wanted
                else "https://plus-resurs.com/labor/employment?tab=mine"
            ),
        )
        self.dispatcher.notify(
            recipient,
            PREFERENCE_FIELD,
            TEMPLATE,
            SUBJECT,
            context,
            TG_CTA,
        )
