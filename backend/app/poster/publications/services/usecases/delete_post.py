"""Удаление поста."""

from app.poster.delivery.services.usecases.delete_messages import DeleteMessagesUseCase
from app.poster.media.services.storage import remove_files
from app.poster.publications.models import Post
from app.poster.publications.services.repo import PostRepository
from app.poster.reposts.services.repo import RepostRepository


class DeletePostUseCase:
    """Удаляет пост с репостами и обсуждением, потом его фото и видео с диска.

    По желанию автора пост удаляется и из Telegram-каналов.
    """

    def __init__(
        self,
        posts: PostRepository,
        reposts: RepostRepository,
        telegram: DeleteMessagesUseCase,
    ) -> None:
        self.posts = posts
        self.reposts = reposts
        self.telegram = telegram

    async def execute(self, post: Post, from_channels: bool) -> None:
        """У удалённого репоста пересчитываются репосты оригинала."""

        if from_channels:
            await self.telegram.execute(post)

        original_id = post.repost_of_id
        paths = await self.posts.media_paths(post.id)

        await self.posts.delete(post)
        if original_id is not None:
            await self.reposts.refresh_count(original_id)

        remove_files(paths)
