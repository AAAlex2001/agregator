from src.accounts.models import Account
from src.accounts.repository import AccountRepository
from src.notifications.usecases.notify_post_activity import NotifyPostActivityUseCase
from src.poster.follows.exceptions import AuthorNotFoundError, SelfFollowError
from src.poster.follows.repository import FollowRepository


class FollowAuthorUseCase:
    """Подписка на автора постов."""

    def __init__(
        self,
        follows: FollowRepository,
        accounts: AccountRepository,
        notify: NotifyPostActivityUseCase,
    ) -> None:
        """Принимает подписки, аккаунты и отправку уведомлений."""
        self.follows = follows
        self.accounts = accounts
        self.notify = notify

    async def execute(self, *, user: Account, author_id: int) -> None:
        """Подписывает на автора и уведомляет его. Повторная подписка ничего не меняет."""
        if author_id == user.id:
            raise SelfFollowError()

        author = await self.accounts.get(author_id)

        if author is None:
            raise AuthorNotFoundError()

        if await self.follows.follow(user.id, author.id):
            await self.notify.execute(
                recipient_id=author.id,
                actor=user,
                kind="follow",
            )
