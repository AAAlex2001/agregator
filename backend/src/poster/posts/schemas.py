from datetime import datetime
from textwrap import shorten

from pydantic import AwareDatetime, BaseModel, Field

from src.accounts.models import Account
from src.poster.delivery.schemas import DeliveryResponse, TelegramOptions
from src.poster.posts.models import MAX_POST_HTML, MAX_POST_MEDIA, MediaKind, Post, PostMedia, PostStatus
from src.poster.posts.text import plain_text


class SavePostRequest(BaseModel):
    """Пост из редактора: текст, файлы и где публиковать — на сайте и/или в каналах."""

    html: str = Field(default="", max_length=MAX_POST_HTML)
    media_ids: list[int] = Field(default_factory=list, max_length=MAX_POST_MEDIA)
    draft: bool = False
    on_site: bool = True
    channel_ids: list[int] = Field(default_factory=list, max_length=20)
    telegram: TelegramOptions = Field(default_factory=TelegramOptions)
    scheduled_at: AwareDatetime | None = None
    reply_to_id: int | None = None


class RepostRequest(BaseModel):
    """Репост с комментарием. Комментарий можно не писать."""

    html: str = Field(default="", max_length=MAX_POST_HTML)


class TelegramPreviewRequest(BaseModel):
    """Текст из редактора и сколько к нему фото и видео — для предпросмотра."""

    html: str = Field(default="", max_length=MAX_POST_HTML)
    media_count: int = Field(default=0, ge=0, le=MAX_POST_MEDIA)


class TelegramPreviewResponse(BaseModel):
    """Как текст будет выглядеть в Telegram и сколько он занимает из лимита."""

    html: str
    length: int
    limit: int


class MediaResponse(BaseModel):
    """Фото или видео поста."""

    id: int
    kind: MediaKind
    url: str

    @classmethod
    def from_media(cls, media: PostMedia) -> "MediaResponse":
        """Собирает ответ из записи о файле."""
        return cls(id=media.id, kind=MediaKind(media.kind), url=media.url)


class AuthorResponse(BaseModel):
    """Автор поста: только публичное имя и фото."""

    id: int
    name: str | None
    avatar_url: str | None

    @classmethod
    def from_account(cls, account: Account) -> "AuthorResponse":
        """Собирает автора из аккаунта: имя и аватар."""
        return cls(id=account.id, name=account.display_name, avatar_url=account.avatar_url)


class OriginalPostResponse(BaseModel):
    """Пост, который репостнули: показывается внутри репоста."""

    id: int
    author: AuthorResponse
    html: str
    media: list[MediaResponse]
    created_at: datetime
    updated_at: datetime
    published_at: datetime | None

    @classmethod
    def from_post(cls, post: Post, authors: dict[int, Account]) -> "OriginalPostResponse":
        """Собирает ответ об оригинале репоста."""
        return cls(
            id=post.id,
            author=AuthorResponse.from_account(authors[post.author_id]),
            html=post.html,
            media=[MediaResponse.from_media(media) for media in post.media],
            created_at=post.created_at,
            updated_at=post.updated_at,
            published_at=post.published_at,
        )


class PostResponse(OriginalPostResponse):
    """Пост целиком: содержимое, счётчики, каналы и отметки того, кто смотрит."""

    title: str
    description: str
    cover_url: str | None
    repost_of: OriginalPostResponse | None
    status: PostStatus
    on_site: bool
    deliveries: list[DeliveryResponse]
    telegram: TelegramOptions
    scheduled_at: datetime | None
    reply_to_id: int | None
    likes_count: int
    comments_count: int
    reposts_count: int
    views_count: int
    liked: bool = False
    saved: bool = False
    following: bool = False

    @classmethod
    def from_post(cls, post: Post, authors: dict[int, Account]) -> "PostResponse":
        """Собирает ответ о посте. В authors должны быть автор поста и автор оригинала репоста."""
        original = None

        if post.repost_of is not None:
            original = OriginalPostResponse.from_post(post.repost_of, authors)

        text = plain_text(post.html)

        if not text and post.repost_of is not None:
            text = plain_text(post.repost_of.html)

        author_name = authors[post.author_id].display_name
        photos = [media.url for media in post.media if media.kind == MediaKind.PHOTO]

        return cls(
            id=post.id,
            author=AuthorResponse.from_account(authors[post.author_id]),
            html=post.html,
            media=[MediaResponse.from_media(media) for media in post.media],
            created_at=post.created_at,
            updated_at=post.updated_at,
            published_at=post.published_at,
            title=shorten(text, 80, placeholder="…") or f"Публикация: {author_name}",
            description=(
                shorten(text, 160, placeholder="…")
                or f"Фото и видео автора {author_name} на «Ресурс-Плюс»"
            ),
            cover_url=photos[0] if photos else None,
            repost_of=original,
            status=PostStatus(post.status),
            on_site=post.on_site,
            deliveries=[DeliveryResponse.from_delivery(delivery) for delivery in post.deliveries],
            telegram=TelegramOptions.model_validate(post.telegram),
            scheduled_at=post.scheduled_at,
            reply_to_id=post.reply_to_id,
            likes_count=post.likes_count,
            comments_count=post.comments_count,
            reposts_count=post.reposts_count,
            views_count=post.views_count,
        )


class PostPageResponse(BaseModel):
    """Страница постов и сколько их всего."""

    items: list[PostResponse]
    total: int


def author_ids(posts: list[Post]) -> set[int]:
    """Собирает id авторов постов и авторов оригиналов у репостов."""
    ids = {post.author_id for post in posts}
    ids |= {post.repost_of.author_id for post in posts if post.repost_of is not None}

    return ids
