"""Сценарий удаления поста."""

from models.posts import Post
from services.posts.repo import PostRepository
from services.posts.uploads import remove_files


class DeletePostUseCase:
    """Удаляет пост с репостами и обсуждением, потом его фото и видео с диска."""

    def __init__(self, posts: PostRepository) -> None:
        self.posts = posts

    async def execute(self, post: Post) -> None:
        """Удаляет пост из базы, затем файлы."""

        paths = await self.posts.media_paths_for_delete(post.id)
        await self.posts.delete(post)
        remove_files(paths)
