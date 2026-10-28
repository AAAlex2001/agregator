from typing import Literal

from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.notifications.models import Notification, NotificationType
from src.notifications.repository import NotificationRepository

PostActivity = Literal["like", "comment", "reply", "repost", "follow"]


class NotifyPostActivityUseCase:
    """Уведомление о том, что кто-то лайкнул пост, прокомментировал, ответил, репостнул или подписался."""

    def __init__(self, notifications: NotificationRepository, accounts: AccountRepository) -> None:
        """Принимает уведомления и аккаунты."""
        self.notifications = notifications
        self.accounts = accounts

    async def execute(
        self,
        *,
        recipient_id: int,
        actor: Account,
        kind: PostActivity,
        post_id: int | None = None,
        comment_id: int | None = None,
    ) -> None:
        """Добавляет уведомление получателю и прибавляет ему непрочитанное. О своих действиях не сообщает."""
        if recipient_id == actor.id:
            return

        action_url = f"/posts/{post_id}" if post_id is not None else f"/posts?author={actor.id}"
        notification = Notification(
            user_id=recipient_id,
            type=NotificationType.POST_ACTIVITY,
            payload={
                "kind": kind,
                "actor_id": actor.id,
                "actor_name": actor.display_name,
                "post_id": post_id,
                "comment_id": comment_id,
            },
            action_url=action_url,
        )
        await self.notifications.add(notification)
        await self.accounts.add_unread_notification(recipient_id)
