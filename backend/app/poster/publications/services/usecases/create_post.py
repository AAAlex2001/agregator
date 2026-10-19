"""Новый пост."""

from app.poster.publications.models import Post
from app.poster.publications.schemas import PostSaveSchema
from app.poster.publications.services.post_form import PostForm
from app.poster.publications.services.repo import PostRepository
from models.account import Account


class CreatePostUseCase:
    """Публикует пост сразу или сохраняет черновиком."""

    def __init__(self, posts: PostRepository, form: PostForm) -> None:
        self.posts = posts
        self.form = form

    async def execute(self, user: Account, payload: PostSaveSchema) -> Post:
        """Новый пост. Пустой — EmptyPostError."""

        post = Post(author_id=user.id)
        await self.form.fill(post, user.id, payload)

        return await self.posts.add(post)
