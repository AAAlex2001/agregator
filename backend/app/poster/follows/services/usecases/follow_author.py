"""Подписка на автора."""

from app.poster.follows.services.exceptions import SelfFollowError
from app.poster.follows.services.repo import FollowRepository
from app.poster.notifications import ActivityNotifier
from models.account import Account


class FollowAuthorUseCase:
    """Подписывает читателя на автора. Автору сообщается только о новой подписке."""

    def __init__(self, follows: FollowRepository, notify: ActivityNotifier) -> None:
        self.follows = follows
        self.notify = notify

    async def execute(self, user: Account, author: Account) -> None:
        """Подписка на себя — SelfFollowError."""

        if author.id == user.id:
            raise SelfFollowError

        if await self.follows.add(user.id, author.id):
            await self.notify.execute(author.id, user, "follow")
