"""Тесты публикаций без БД: очистка текста, публикация, черновик и объявления."""

import asyncio
from datetime import UTC, datetime

import pytest

from models.account import Account
from models.posts import Post, PostComment, PostMedia, PostStatus
from schemas.posts import (
    CommentSaveSchema,
    PostSaveSchema,
    PostSchema,
    RepostSaveSchema,
    ViewerMarks,
)
from services.posts.exceptions import (
    CommentNotFoundError,
    EmptyPostError,
    PostMediaUnavailableError,
)
from services.posts.html import clean_html
from services.posts.use_cases.create_comment import CreateCommentUseCase
from services.posts.use_cases.create_post import CreatePostUseCase
from services.posts.use_cases.create_repost import CreateRepostUseCase


class FakeNotify:
    """Запоминает, кому ушли уведомления."""

    def __init__(self) -> None:
        self.sent: list[tuple[int, str]] = []

    async def execute(self, user_id, actor, kind, post_id=None, comment_id=None):
        self.sent.append((user_id, kind))


AUTHOR = Account(id=1, email="anna@mail.ru", first_name="Анна")


class FakeMediaRepository:
    """Свободные файлы автора."""

    def __init__(self, items: list[PostMedia]) -> None:
        self.items = items

    async def list_usable(self, owner_id: int, media_ids: list[int], post_id: int | None) -> list[PostMedia]:
        return [
            item
            for item in self.items
            if item.id in media_ids
            and item.owner_id == owner_id
            and (item.post_id is None or item.post_id == post_id)
        ]


class FakePostRepository:
    """Свои опубликованные объявления автора и сохранение поста."""

    async def add(self, post: Post) -> Post:
        post.id = 1

        return post


def save(payload: PostSaveSchema, media: list[PostMedia] | None = None) -> Post:
    usecase = CreatePostUseCase(FakePostRepository(), FakeMediaRepository(media or []))

    return asyncio.run(usecase.execute(AUTHOR, payload))


def test_clean_html_keeps_editor_tags_and_drops_scripts() -> None:
    html = (
        '<p onclick="steal()">Привет <strong>мир</strong><script>alert(1)</script></p>'
        '<a href="javascript:alert(1)">плохая</a><a href="https://ya.ru">хорошая</a>'
    )

    cleaned = clean_html(html)

    assert "<strong>мир</strong>" in cleaned
    assert "script" not in cleaned
    assert "onclick" not in cleaned
    assert "javascript" not in cleaned
    assert 'href="https://ya.ru"' in cleaned


def test_post_is_published_at_once_with_media_in_order() -> None:
    photo = PostMedia(id=7, owner_id=AUTHOR.id, kind="photo", path="posts/a.jpg")
    video = PostMedia(id=8, owner_id=AUTHOR.id, kind="video", path="posts/b.mp4")

    post = save(PostSaveSchema(html="<p>Заготовки</p>", media_ids=[8, 7]), [photo, video])

    assert post.status == PostStatus.PUBLISHED
    assert post.published_at is not None
    assert [item.id for item in post.media] == [8, 7]


def test_draft_is_not_published() -> None:
    post = save(PostSaveSchema(html="<p>Позже</p>", draft=True))

    assert post.status == PostStatus.DRAFT
    assert post.published_at is None


@pytest.mark.parametrize(
    "html", ["<p><br></p>", "<p>&nbsp;</p>", "<p>&#32;</p>", "<script>alert(1)</script>"]
)
def test_empty_post_is_not_saved(html: str) -> None:
    with pytest.raises(EmptyPostError):
        save(PostSaveSchema(html=html))


def test_foreign_media_is_not_attached() -> None:
    stranger = PostMedia(id=9, owner_id=2, kind="photo", path="posts/c.jpg")

    with pytest.raises(PostMediaUnavailableError):
        save(PostSaveSchema(html="<p>Текст</p>", media_ids=[9]), [stranger])


def test_viewer_marks_come_from_sets() -> None:
    post = save(PostSaveSchema(html="<p>Текст</p>"))
    post.author = AUTHOR
    post.likes_count = 0
    post.comments_count = 0
    post.reposts_count = 0
    post.views_count = 0
    post.created_at = datetime(2026, 10, 10, tzinfo=UTC)

    schema = PostSchema.for_viewer(post, ViewerMarks(liked={post.id}, following={AUTHOR.id}))

    assert schema.liked is True
    assert schema.saved is False
    assert schema.following is True


def page_schema(post: Post) -> PostSchema:
    post.author = AUTHOR
    post.likes_count = 0
    post.comments_count = 0
    post.reposts_count = 0
    post.views_count = 0
    post.created_at = datetime(2026, 10, 10, tzinfo=UTC)
    return PostSchema.model_validate(post)


def test_page_title_description_and_cover_come_from_post() -> None:
    video = PostMedia(id=1, owner_id=AUTHOR.id, kind="video", path="posts/a.mp4")
    photo = PostMedia(id=2, owner_id=AUTHOR.id, kind="photo", path="posts/b.jpg")
    long_text = "слово " * 50
    post = save(PostSaveSchema(html=f"<p>{long_text}</p>", media_ids=[1, 2]), [video, photo])

    schema = page_schema(post)

    assert len(schema.title) <= 80
    assert schema.title.startswith("слово слово")
    assert len(schema.description) <= 160
    assert schema.cover_url == "/uploads/posts/b.jpg"


def test_page_title_of_post_without_text_names_author() -> None:
    video = PostMedia(id=1, owner_id=AUTHOR.id, kind="video", path="posts/a.mp4")
    post = save(PostSaveSchema(media_ids=[1]), [video])

    schema = page_schema(post)

    assert schema.title == "Публикация: Анна"
    assert "Анна" in schema.description
    assert schema.cover_url is None


class FakeRepostRepository:
    """Сохранённые репосты и пересчитанные оригиналы."""

    def __init__(self) -> None:
        self.refreshed: list[int] = []

    async def add(self, post: Post) -> Post:
        return post

    async def refresh_reposts(self, post_id: int) -> None:
        self.refreshed.append(post_id)


def test_repost_of_repost_points_to_original() -> None:
    posts = FakeRepostRepository()
    original = Post(id=1, author_id=2)
    repost = Post(id=2, author_id=3, repost_of_id=1, repost_of=original)

    simple = asyncio.run(CreateRepostUseCase(posts, FakeNotify()).execute(AUTHOR, repost, RepostSaveSchema()))
    commented = asyncio.run(
        CreateRepostUseCase(posts, FakeNotify()).execute(
            AUTHOR, original, RepostSaveSchema(html="<p>Советую</p>")
        )
    )

    assert simple.repost_of_id == original.id
    assert simple.html == ""
    assert simple.status == PostStatus.PUBLISHED
    assert commented.html == "<p>Советую</p>"
    assert posts.refreshed == [original.id, original.id]


class FakeCommentRepository:
    """Комментарии одного поста в списке."""

    def __init__(self) -> None:
        self.items: list[PostComment] = []

    async def get_by_id(self, comment_id: int) -> PostComment | None:
        return next((item for item in self.items if item.id == comment_id), None)

    async def add(self, comment: PostComment) -> PostComment:
        comment.id = len(self.items) + 1
        self.items.append(comment)

        return comment


def comment(comments: FakeCommentRepository, post: Post, reply_to_id: int | None = None) -> PostComment:
    usecase = CreateCommentUseCase(comments, FakeNotify())
    payload = CommentSaveSchema(text="  Есть время?  ", reply_to_id=reply_to_id)

    return asyncio.run(usecase.execute(AUTHOR, post, payload))


def test_replies_go_into_thread_of_root_comment() -> None:
    post = Post(id=1, author_id=AUTHOR.id)
    comments = FakeCommentRepository()

    root = comment(comments, post)
    reply = comment(comments, post, reply_to_id=root.id)
    reply_to_reply = comment(comments, post, reply_to_id=reply.id)

    assert root.parent_id is None
    assert root.text == "Есть время?"
    assert reply.parent_id == root.id
    assert reply_to_reply.parent_id == root.id
    assert reply_to_reply.reply_to_id == reply.id


def test_reply_to_comment_of_other_post_is_rejected() -> None:
    comments = FakeCommentRepository()
    other = comment(comments, Post(id=2, author_id=AUTHOR.id))

    with pytest.raises(CommentNotFoundError):
        comment(comments, Post(id=1, author_id=AUTHOR.id), reply_to_id=other.id)


def test_attached_media_cannot_be_stolen_by_another_post():
    photo = PostMedia(id=9, owner_id=AUTHOR.id, post_id=100, kind="photo", path="posts/a.jpg")
    with pytest.raises(PostMediaUnavailableError):
        save(PostSaveSchema(html="Текст", media_ids=[9]), [photo])


def test_duplicate_media_is_attached_once():
    photo = PostMedia(id=9, owner_id=AUTHOR.id, kind="photo", path="posts/a.jpg")
    post = save(PostSaveSchema(media_ids=[9, 9]), [photo])
    assert len(post.media) == 1


def test_whitespace_comments_and_reports_are_rejected():
    from pydantic import ValidationError

    from schemas.posts import ReportSaveSchema

    for schema, payload in [(CommentSaveSchema, {"text": "   "}), (ReportSaveSchema, {"reason": "   "})]:
        with pytest.raises(ValidationError):
            schema(**payload)


def test_author_schema_does_not_expose_private_contacts():
    from schemas.posts import PostAuthorSchema

    author = PostAuthorSchema.model_validate(
        Account(id=7, first_name="Имя", last_name="Фамилия", email="private@example.test")
    )
    assert author.name == "Имя Фамилия"
    assert set(author.model_dump()) == {"id", "name", "avatar_url"}


def test_hidden_post_stays_hidden_after_author_edit():
    from services.posts.use_cases.post_form import PostFormUseCase

    post = Post(id=8, author_id=AUTHOR.id, status=PostStatus.HIDDEN)
    asyncio.run(
        PostFormUseCase(FakePostRepository(), FakeMediaRepository([])).fill(
            post, AUTHOR.id, PostSaveSchema(html="Новая версия")
        )
    )
    assert post.status == PostStatus.HIDDEN


def test_repost_cannot_be_edited():
    from services.posts.exceptions import RepostNotEditableError
    from services.posts.use_cases.update_post import UpdatePostUseCase

    repost = Post(id=5, author_id=AUTHOR.id, repost_of_id=1)
    with pytest.raises(RepostNotEditableError):
        asyncio.run(
            UpdatePostUseCase(FakePostRepository(), FakeMediaRepository([])).execute(
                repost, PostSaveSchema(html="Правка")
            )
        )


def test_reply_notifies_author_of_the_comment():
    reader = Account(id=2, first_name="Читатель")
    post = Post(id=1, author_id=AUTHOR.id)
    comments = FakeCommentRepository()
    notify = FakeNotify()
    root = asyncio.run(
        CreateCommentUseCase(comments, notify).execute(reader, post, CommentSaveSchema(text="Вопрос"))
    )
    asyncio.run(
        CreateCommentUseCase(comments, notify).execute(
            AUTHOR, post, CommentSaveSchema(text="Ответ", reply_to_id=root.id)
        )
    )
    assert notify.sent == [(AUTHOR.id, "comment"), (reader.id, "reply")]
