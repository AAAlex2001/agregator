"""Сценарий подписки на автора."""

from models.account import Account
from services.notifications.use_cases.create_post_activity_notification import (
    CreatePostActivityNotificationUseCase,
)
from services.posts.exceptions import SelfFollowError
from services.posts.follow_repository import FollowRepository


class FollowAuthorUseCase:
    """Подписывает читателя на автора. Автору сообщается только о новой подписке."""

    def __init__(self, follows: FollowRepository, notify: CreatePostActivityNotificationUseCase) -> None:
        self.follows = follows
        self.notify = notify

    async def execute(self, user: Account, author: Account) -> None:
        """Подписка на себя — SelfFollowError."""

        if author.id == user.id:
            raise SelfFollowError()
        if await self.follows.add(user.id, author.id):
            await self.notify.execute(author.id, user, "follow")
