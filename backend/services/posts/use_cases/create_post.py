"""Сценарий нового поста."""

from models.account import Account
from models.posts import Post
from schemas.posts import PostSaveSchema
from services.posts.use_cases.post_form import PostFormUseCase


class CreatePostUseCase(PostFormUseCase):
    """Публикует пост сразу или сохраняет черновиком."""

    async def execute(self, user: Account, payload: PostSaveSchema) -> Post:
        """Новый пост. Пустой — EmptyPostError."""

        post = Post(author_id=user.id)
        await self.fill(post, user.id, payload)
        return await self.posts.add(post)
