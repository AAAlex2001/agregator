"""Общее для создания и правки поста: проверка текста и файлов, перенос полей формы."""

from datetime import UTC, datetime

from models.posts import Post, PostMedia, PostStatus
from schemas.posts import PostSaveSchema
from services.posts.exceptions import EmptyPostError, PostMediaUnavailableError
from services.posts.html import check_text_length, clean_html, plain_text
from services.posts.repo import PostMediaRepository, PostRepository


class PostFormUseCase:
    """Проверяет форму поста и записывает её в пост."""

    def __init__(self, posts: PostRepository, media: PostMediaRepository) -> None:
        self.posts = posts
        self.media = media

    async def check_media(
        self,
        owner_id: int,
        media_ids: list[int],
        post_id: int | None,
    ) -> list[PostMedia]:
        """Файлы в порядке формы. Чужой или занятый другим постом — PostMediaUnavailableError."""

        media_ids = list(dict.fromkeys(media_ids))
        files = await self.media.list_usable(owner_id, media_ids, post_id)
        if len(files) != len(media_ids):
            raise PostMediaUnavailableError()

        by_id = {item.id: item for item in files}
        return [by_id[media_id] for media_id in media_ids]

    async def fill(self, post: Post, owner_id: int, payload: PostSaveSchema) -> None:
        """Переносит текст, файлы и статус. Пустой пост — EmptyPostError.

        Скрытый модератором пост остаётся скрытым.
        """

        html = clean_html(payload.html)
        check_text_length(html)
        media = await self.check_media(owner_id, payload.media_ids, post.id)
        if not plain_text(html) and not media:
            raise EmptyPostError()

        for position, item in enumerate(media):
            item.sort_order = position

        now = datetime.now(UTC)
        post.html = html
        post.media = media
        post.updated_at = now

        if post.status != PostStatus.HIDDEN:
            post.status = PostStatus.DRAFT if payload.draft else PostStatus.PUBLISHED
        if post.status == PostStatus.PUBLISHED and post.published_at is None:
            post.published_at = now
