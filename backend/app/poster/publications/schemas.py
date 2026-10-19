"""Публикация в запросах и ответах API."""

from dataclasses import dataclass, field
from datetime import datetime
from textwrap import shorten
from typing import Self

from pydantic import BaseModel, ConfigDict, Field, computed_field, model_validator

from app.poster.delivery.schemas import DeliverySchema
from app.poster.media.models import MAX_POST_MEDIA, MediaKind
from app.poster.media.schemas import PostMediaSchema
from app.poster.publications.models import MAX_POST_HTML, Post, PostStatus
from app.poster.publications.services.text import plain_text
from models.account import Account

TITLE_LENGTH = 80
DESCRIPTION_LENGTH = 160
DEFAULT_AUTHOR_NAME = "Участник «Ресурс-Плюс»"
MAX_POST_CHANNELS = 20


@dataclass
class ViewerMarks:
    """Кто смотрит и что он отметил: лайкнутые и сохранённые посты, авторы в подписках."""

    viewer_id: int | None = None
    liked: set[int] = field(default_factory=set)
    saved: set[int] = field(default_factory=set)
    following: set[int] = field(default_factory=set)


class PostSaveSchema(BaseModel):
    """Текст, файлы и где публиковать: на сайте и/или в Telegram-каналах."""

    html: str = Field("", max_length=MAX_POST_HTML, description="Текст из редактора в HTML")
    media_ids: list[int] = Field([], max_length=MAX_POST_MEDIA, description="Фото и видео по порядку")
    draft: bool = Field(False, description="Сохранить черновиком, не публикуя")
    on_site: bool = Field(True, description="Показать в ленте сайта")
    channel_ids: list[int] = Field([], max_length=MAX_POST_CHANNELS, description="Каналы для публикации")


class PostAuthorSchema(BaseModel):
    """Автор: только публичное имя и фото."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID пользователя")
    name: str | None = Field(None, description="Имя")
    avatar_url: str | None = Field(None, description="Адрес аватара")

    @model_validator(mode="before")
    @classmethod
    def from_account(cls, value: object) -> object:
        """Берёт публичное имя и фото из аккаунта."""

        if isinstance(value, Account):
            return {"id": value.id, "name": value.display_name, "avatar_url": value.avatar_url}

        return value


class OriginalPostSchema(BaseModel):
    """Публикация, которую репостнули: показывается внутри репоста."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID поста")
    author: PostAuthorSchema = Field(..., description="Автор")
    html: str = Field(..., description="Очищенный текст в HTML")
    media: list[PostMediaSchema] = Field(..., description="Фото и видео")
    created_at: datetime = Field(..., description="Когда создан")
    updated_at: datetime = Field(..., description="Когда изменено содержимое")
    published_at: datetime | None = Field(None, description="Когда опубликован")


class PostSchema(BaseModel):
    """Пост целиком. liked, saved и following — для того, кто смотрит."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="ID поста")
    author: PostAuthorSchema = Field(..., description="Автор")
    html: str = Field(..., description="Очищенный текст в HTML")
    media: list[PostMediaSchema] = Field(..., description="Фото и видео")
    repost_of: OriginalPostSchema | None = Field(None, description="Оригинал, если это репост")
    on_site: bool = Field(True, description="Пост в ленте сайта")
    deliveries: list[DeliverySchema] = Field([], description="Каналы поста — видит только автор")
    status: PostStatus = Field(..., description="Черновик, опубликован или скрыт")
    likes_count: int = Field(..., description="Сколько лайков")
    comments_count: int = Field(..., description="Сколько комментариев")
    reposts_count: int = Field(..., description="Сколько репостов")
    views_count: int = Field(..., description="Сколько раз смотрели")
    liked: bool = Field(False, description="Вы поставили лайк")
    saved: bool = Field(False, description="Пост у вас в сохранённом")
    following: bool = Field(False, description="Вы подписаны на автора")
    created_at: datetime = Field(..., description="Когда создан")
    updated_at: datetime = Field(..., description="Когда изменено содержимое")
    published_at: datetime | None = Field(None, description="Когда опубликован")

    def visible_text(self) -> str:
        """Текст без разметки. У репоста без комментария — текст оригинала."""

        text = plain_text(self.html)
        if not text and self.repost_of:
            text = plain_text(self.repost_of.html)

        return text

    def author_name(self) -> str:
        """Имя автора для заголовков страницы."""

        return self.author.name or DEFAULT_AUTHOR_NAME

    @computed_field(description="Заголовок страницы публикации")
    def title(self) -> str:
        """Начало текста, а пост без текста — по имени автора."""

        text = self.visible_text()
        if not text:
            return f"Публикация: {self.author_name()}"

        return shorten(text, TITLE_LENGTH, placeholder="…")

    @computed_field(description="Описание страницы публикации")
    def description(self) -> str:
        """Начало текста, а пост без текста — о фото и видео автора."""

        text = self.visible_text()
        if not text:
            return f"Фото и видео автора {self.author_name()} на «Ресурс-Плюс»"

        return shorten(text, DESCRIPTION_LENGTH, placeholder="…")

    @computed_field(description="Первое фото — обложка для превью ссылки")
    def cover_url(self) -> str | None:
        """Адрес первого фото или None."""

        photos = [item.url for item in self.media if item.kind == MediaKind.PHOTO]

        return photos[0] if photos else None

    @classmethod
    def for_viewer(cls, post: Post, marks: ViewerMarks) -> Self:
        """Пост с отметками того, кто смотрит. Каналы поста видит только автор."""

        schema = cls.model_validate(post)
        schema.liked = post.id in marks.liked
        schema.saved = post.id in marks.saved
        schema.following = post.author_id in marks.following

        if post.author_id != marks.viewer_id:
            schema.deliveries = []

        return schema


class PostPageSchema(BaseModel):
    """Страница постов и сколько их всего."""

    items: list[PostSchema]
    total: int = Field(..., description="Сколько постов всего")

    @classmethod
    def for_viewer(cls, posts: list[Post], total: int, marks: ViewerMarks) -> Self:
        """Страница постов с отметками того, кто смотрит."""

        items = [PostSchema.for_viewer(post, marks) for post in posts]

        return cls(items=items, total=total)
