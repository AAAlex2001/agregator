from src.poster.posts.exceptions import PostNotFoundError
from src.poster.posts.repository import PostRepository
from src.poster.posts.storage import MediaStorage


class DeletePostByModeratorUseCase:
    """Модератор удаляет пост, нарушающий правила."""

    def __init__(self, posts: PostRepository, storage: MediaStorage) -> None:
        """Принимает посты и файлы на диске."""
        self.posts = posts
        self.storage = storage

    async def execute(self, *, post_id: int) -> None:
        """Удаляет пост с сайта вместе с его фото и видео. В Telegram-каналах пост остаётся."""
        post = await self.posts.get(post_id)

        if post is None:
            raise PostNotFoundError()

        if post.repost_of_id is not None:
            await self.posts.change_reposts_count(post.repost_of_id, -1)

        paths = [media.path for media in post.media]
        await self.posts.delete(post)
        self.storage.delete(paths)
