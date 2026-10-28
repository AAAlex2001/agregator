from src.accounts.models import Account
from src.poster.follows.repository import FollowRepository


class UnfollowAuthorUseCase:
    """Отписка от автора постов."""

    def __init__(self, follows: FollowRepository) -> None:
        """Принимает подписки."""
        self.follows = follows

    async def execute(self, *, user: Account, author_id: int) -> None:
        """Отписывает от автора. Если подписки не было, ничего не меняет."""
        await self.follows.unfollow(user.id, author_id)
