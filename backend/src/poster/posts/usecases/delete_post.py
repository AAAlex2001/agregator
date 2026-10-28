from src.accounts.models import Account
from src.poster.delivery.usecases.withdraw_messages import WithdrawMessagesUseCase
from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository
from src.poster.posts.storage import MediaStorage


class DeletePostUseCase:
    """Удаление своего поста."""

    def __init__(
        self,
        posts: PostRepository,
        storage: MediaStorage,
        withdraw_messages: WithdrawMessagesUseCase,
    ) -> None:
        """Принимает посты, файлы на диске и удаление сообщений из Telegram."""
        self.posts = posts
        self.storage = storage
        self.withdraw_messages = withdraw_messages

    async def execute(self, *, user: Account, post_id: int, from_channels: bool) -> None:
        """Удаляет пост с его файлами, а если попросили — и из Telegram-каналов."""
        post = await self.posts.get_for_author(post_id, user.id)

        if post is None:
            raise PostNotFoundError()

        if from_channels:
            await self.withdraw_messages.execute(post_id=post.id)

        if post.repost_of_id is not None:
            await self.posts.change_reposts_count(post.repost_of_id, -1)

        paths = [media.path for media in post.media]
        await self.posts.delete(post)
        self.storage.delete(paths)
