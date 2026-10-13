"""Сценарий правки своего поста."""

from models.posts import Post
from schemas.posts import PostSaveSchema
from services.posts.exceptions import RepostNotEditableError
from services.posts.uploads import remove_files
from services.posts.use_cases.post_form import PostFormUseCase


class UpdatePostUseCase(PostFormUseCase):
    """Меняет текст и файлы поста, публикует черновик или возвращает в черновики."""

    async def execute(self, post: Post, payload: PostSaveSchema) -> Post:
        """Изменённый пост. Убранные из поста файлы удаляются с диска после записи в базу."""

        if post.repost_of_id is not None:
            raise RepostNotEditableError()

        post = await self.posts.get_for_update(post.id)
        old_paths = {item.path for item in post.media}
        await self.fill(post, post.author_id, payload)
        updated = await self.posts.save(post)
        remove_files(list(old_paths - {item.path for item in updated.media}))
        return updated
