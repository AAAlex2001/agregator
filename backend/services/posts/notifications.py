from dataclasses import dataclass
from enum import StrEnum

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from models.account import Account
from models.notification import Notification, NotificationType


class NotificationKind(StrEnum):
    LIKE = "like"
    COMMENT = "comment"
    REPLY = "reply"
    REPOST = "repost"
    FOLLOW = "follow"


@dataclass
class PostNotification:
    user_id: int
    actor_id: int
    kind: NotificationKind
    post_id: int | None = None
    comment_id: int | None = None


class NotifyUseCase:
    """Добавляет уведомление о публикации в кабинет получателя."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def execute(self, event: PostNotification) -> None:
        """Пропускает свои действия и повторные лайки или подписки."""
        if event.user_id == event.actor_id:
            return
        actor = await self.db.get(Account, event.actor_id)
        if actor is None:
            return
        payload = {
            "kind": event.kind.value,
            "actor_id": event.actor_id,
            "actor_name": actor.display_name,
            "post_id": event.post_id,
            "comment_id": event.comment_id,
        }
        if event.kind in (NotificationKind.LIKE, NotificationKind.FOLLOW):
            existing = await self.db.scalar(
                select(Notification.id)
                .where(
                    Notification.user_id == event.user_id,
                    Notification.type == NotificationType.POST_ACTIVITY,
                    Notification.payload["actor_id"].as_integer() == event.actor_id,
                    Notification.payload["kind"].as_string() == event.kind.value,
                    Notification.payload["post_id"].as_integer() == event.post_id,
                )
                .limit(1)
            )
            if existing is not None:
                return
        action_url = f"/posts/{event.post_id}" if event.post_id else f"/posts?author={event.actor_id}"
        self.db.add(
            Notification(
                user_id=event.user_id,
                type=NotificationType.POST_ACTIVITY,
                payload=payload,
                action_url=action_url,
            )
        )
        await self.db.execute(
            update(Account)
            .where(Account.id == event.user_id)
            .values(notification_unread_count=Account.notification_unread_count + 1)
        )
        await self.db.flush()
