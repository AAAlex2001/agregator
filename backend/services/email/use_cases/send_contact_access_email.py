from schemas.email import ContactAccessEmailContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "contact_access"
CTA_URL = "https://plus-resurs.com/expert-contacts"


class SendContactAccessEmailUseCase:
    def __init__(self, repository: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repository = repository
        self.dispatcher = dispatcher

    async def execute(self, user_id: int, title: str, message: str) -> None:
        recipient = await self.repository.find_user(user_id)
        if recipient is None or not recipient.email:
            return
        context = ContactAccessEmailContext(
            recipient_greeting=greeting_for(recipient),
            heading=title,
            message=message,
            cta_url=CTA_URL,
        )
        self.dispatcher.dispatch(
            recipient.email,
            TEMPLATE,
            f"{title} — Ресурс-Плюс",
            context,
        )
