"""Правка своего поста."""

from app.poster.delivery.services.usecases.edit_messages import EditMessagesUseCase
from app.poster.media.services.storage import remove_files
from app.poster.publications.models import Post, PostStatus
from app.poster.publications.schemas import PostSaveSchema
from app.poster.publications.services.exceptions import RepostNotEditableError, SentMediaLockedError
from app.poster.publications.services.post_form import PostForm, has_sent_messages
from app.poster.publications.services.repo import PostRepository


class UpdatePostUseCase:
    """Меняет текст, файлы и каналы, публикует черновик или возвращает пост в черновики.

    Текст уже вышедшего в Telegram поста меняется и в каналах.
    """

    def __init__(self, posts: PostRepository, form: PostForm, telegram: EditMessagesUseCase) -> None:
        self.posts = posts
        self.form = form
        self.telegram = telegram

    async def execute(self, post: Post, payload: PostSaveSchema) -> Post:
        """Репост — RepostNotEditableError. Убранные файлы удаляются с диска после записи в базу."""

        if post.repost_of_id is not None:
            raise RepostNotEditableError

        post = await self.posts.get_for_update(post.id)
        old_media_ids = [item.id for item in post.media]
        old_paths = {item.path for item in post.media}

        if has_sent_messages(post) and payload.media_ids != old_media_ids:
            raise SentMediaLockedError

        await self.form.fill(post, post.author_id, payload)
        updated = await self.posts.save(post)

        if updated.status == PostStatus.PUBLISHED:
            await self.telegram.execute(updated)

        remove_files(list(old_paths - {item.path for item in updated.media}))

        return updated
