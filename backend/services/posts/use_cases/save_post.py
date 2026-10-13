"""Общее для создания и правки поста: проверка файлов, перенос полей."""

from datetime import UTC, datetime

from models.posts import Post, PostMedia, PostStatus
from schemas.posts import PostSaveSchema
from services.posts.exceptions import (
    EmptyPostError,
    PostMediaNotFoundError,
)
from services.posts.html import clean_html, has_text
from services.posts.repo import PostMediaRepository, PostRepository


class SavePostUseCase:
    """Проверить файлы поста и записать поля формы в пост."""

    def __init__(self, posts: PostRepository, media: PostMediaRepository) -> None:
        self.posts = posts
        self.media = media

    async def check_media(self, owner_id: int, media_ids: list[int], post_id: int | None) -> list[PostMedia]:
        """Файлы по порядку из формы. Чужой или занятый другим постом — PostMediaNotFoundError."""

        media_ids = list(dict.fromkeys(media_ids))
        files = await self.media.list_usable(owner_id, media_ids, post_id)
        if len(files) != len(media_ids):
            raise PostMediaNotFoundError("Файл не найден, загрузите его заново")

        by_id = {item.id: item for item in files}

        return [by_id[media_id] for media_id in media_ids]

    async def fill(self, post: Post, owner_id: int, payload: PostSaveSchema) -> None:
        """Перенести поля в пост. Пустой — EmptyPostError."""

        html = clean_html(payload.html)
        media = await self.check_media(owner_id, payload.media_ids, post.id)
        if not has_text(html) and not media:
            raise EmptyPostError("Напишите текст, добавьте фото или видео")

        for position, item in enumerate(media):
            item.sort_order = position

        post.updated_at = datetime.now(UTC)
        post.html = html
        post.media = media
        if post.status != PostStatus.HIDDEN:
            post.status = PostStatus.DRAFT if payload.draft else PostStatus.PUBLISHED

        if post.status == PostStatus.PUBLISHED and post.published_at is None:
            post.published_at = datetime.now(UTC)
