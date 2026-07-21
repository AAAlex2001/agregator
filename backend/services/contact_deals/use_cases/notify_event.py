from services.email import SendContactAccessEmailUseCase
from services.notifications import CreateContactAccessNotificationUseCase


class NotifyContactAccessEventUseCase:
    def __init__(
        self,
        notification: CreateContactAccessNotificationUseCase,
        email: SendContactAccessEmailUseCase,
    ) -> None:
        self.notification = notification
        self.email = email

    async def execute(self, user_id: int, title: str, message: str) -> None:
        await self.notification.execute(user_id, title, message)
        await self.email.execute(user_id, title, message)
