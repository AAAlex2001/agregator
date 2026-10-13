"""Сценарий удаления поста."""

from models.posts import Post
from services.posts.repo import PostRepository
from services.posts.uploads import remove_file


class DeletePostUseCase:
    """Удалить пост вместе с его фото и видео на диске. У репоста — пересчитать репосты оригинала."""

    def __init__(self, posts: PostRepository) -> None:
        self.posts = posts

    async def execute(self, post: Post) -> None:
        """Удалить пост из базы, потом его файлы."""

        paths = [item.path for item in post.media]
        original_id = post.repost_of_id
        await self.posts.delete(post)

        for path in paths:
            remove_file(path)

        if original_id is not None:
            await self.posts.refresh_reposts(original_id)
