"""Сценарий нового поста."""

from models.account import Account
from models.posts import Post
from schemas.posts import PostSaveSchema
from services.posts.use_cases.save_post import SavePostUseCase


class CreatePostUseCase(SavePostUseCase):
    """Опубликовать пост сразу или сохранить черновиком."""

    async def execute(self, user: Account, payload: PostSaveSchema) -> Post:
        """Вернуть новый пост. Пустой — EmptyPostError."""

        post = Post(author_id=user.id)
        await self.fill(post, user.id, payload)

        return await self.posts.add(post)
