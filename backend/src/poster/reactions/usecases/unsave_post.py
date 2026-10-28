from src.accounts.models import Account
from src.poster.reactions.repository import ReactionRepository


class UnsavePostUseCase:
    """Удаление поста из сохранённых."""

    def __init__(self, reactions: ReactionRepository) -> None:
        """Принимает сохранения."""
        self.reactions = reactions

    async def execute(self, *, user: Account, post_id: int) -> None:
        """Убирает пост из сохранённых пользователя."""
        await self.reactions.unsave(user.id, post_id)
