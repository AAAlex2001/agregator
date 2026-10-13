"Use case: уведомление о реакции на публикацию или подписке на автора."

from typing import Literal

from models.account import Account
from models.notification import Notification, NotificationType
from schemas.notification import PostActivityNotificationPayload
from services.notifications.repository import NotificationRepository

PostActivity = Literal["like", "comment", "reply", "repost", "follow"]


class CreatePostActivityNotificationUseCase:
    """In-app уведомление: лайк, комментарий, ответ, репост или подписка.

    О своих действиях не сообщает.
    """

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        user_id: int,
        actor: Account,
        kind: PostActivity,
        post_id: int | None = None,
        comment_id: int | None = None,
    ) -> None:
        "Добавляет уведомление получателю и увеличивает его счётчик непрочитанных."
        if user_id == actor.id:
            return

        if post_id:
            action_url = f"/posts/{post_id}"
        else:
            action_url = f"/posts?author={actor.id}"

        payload = PostActivityNotificationPayload(
            kind=kind,
            actor_id=actor.id,
            actor_name=actor.display_name,
            post_id=post_id,
            comment_id=comment_id,
        )
        notification = Notification(
            user_id=user_id,
            type=NotificationType.POST_ACTIVITY,
            payload=payload.model_dump(mode="json"),
            action_url=action_url,
        )
        await self.repo.add(notification)
        await self.repo.flush()
        await self.repo.increment_unread(user_id)
