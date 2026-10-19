"""Проверки модерации, временных файлов и параллельных действий в изолированной БД."""

import asyncio
from datetime import UTC, datetime, timedelta
from io import BytesIO

import pytest
from PIL import Image
from sqlalchemy import func, select

from app.poster.media.models import PostMedia
from app.poster.media.services.repo import PostMediaRepository
from app.poster.publications.models import Post, PostStatus

pytestmark = pytest.mark.integration
ADMIN = {"x-internal-token": "posts-test-admin"}


def login(client, index=0):
    """Выбирает тестовый аккаунт без внешней авторизации."""
    client.cookies.clear()
    client.cookies.set("session_id", f"posts-test-{index}")


async def publish(client, **extra):
    """Создаёт запись через реальный API."""
    response = await client.post("/api/posts", json={"html": "<p>Проверка</p>", **extra})
    assert response.status_code == 201, response.text
    return response.json()


def photo():
    """Маленькое настоящее фото с намеренно неверным расширением."""
    content = BytesIO()
    Image.new("RGB", (2, 2), "orange").save(content, format="PNG")
    return {"file": ("unknown.bin", content.getvalue(), "application/octet-stream")}


async def test_media_auto_detects_content_and_protects_attached_files(post_client):
    client = post_client
    login(client)
    response = await client.post("/api/posts/media", files=photo())
    assert response.status_code == 201, response.text
    item = response.json()
    assert item["kind"] == "photo"
    assert item["url"].endswith(".png")
    saved = await publish(client, media_ids=[item["id"]], draft=True)
    assert (await client.delete(f"/api/posts/media/{item['id']}")).status_code == 404
    login(client, 1)
    assert (await client.delete(f"/api/posts/media/{item['id']}")).status_code == 404
    login(client)
    assert (await client.get(f"/api/posts/{saved['id']}")).json()["media"] == [item]
    response = await client.post(
        "/api/posts/media", files={"file": ("unknown.bin", b"0000ftypmp42video", "application/octet-stream")}
    )
    assert response.status_code == 201, response.text
    assert response.json()["kind"] == "video"
    rejected = await client.post("/api/posts/media", files={"file": ("evil.png", b"<script>bad()</script>")})
    assert rejected.status_code == 422


async def test_concurrent_uploads_cannot_exceed_free_media_limit(post_client, posts_database):
    client = post_client
    login(client)
    async with posts_database() as db:
        db.add_all([PostMedia(owner_id=1, kind="photo", path=f"posts/free-{i}.png") for i in range(29)])
        await db.commit()
    responses = await asyncio.gather(
        client.post("/api/posts/media", files=photo()),
        client.post("/api/posts/media", files=photo()),
    )
    assert sorted(response.status_code for response in responses) == [201, 422]
    async with posts_database() as db:
        assert await db.scalar(select(func.count()).select_from(PostMedia)) == 30


async def test_cleanup_keeps_drafts_recent_and_locked_media(post_client, posts_database, monkeypatch):
    from app.poster.media import tasks as post_media_cleanup
    from app.poster.media.services import storage as uploads

    monkeypatch.setattr(post_media_cleanup, "SessionLocal", posts_database)
    old = datetime.now(UTC) - timedelta(days=2)
    async with posts_database() as db:
        draft = Post(author_id=1, html="Черновик", status=PostStatus.DRAFT)
        db.add(draft)
        await db.flush()
        files = [
            PostMedia(owner_id=1, kind="photo", path="posts/expired.png", created_at=old),
            PostMedia(owner_id=1, kind="photo", path="posts/recent.png"),
            PostMedia(owner_id=1, kind="photo", path="posts/draft.png", created_at=old, post_id=draft.id),
            PostMedia(owner_id=1, kind="photo", path="posts/locked.png", created_at=old),
        ]
        db.add_all(files)
        await db.commit()
        locked_id = files[-1].id
        draft_id = draft.id
    for item in files:
        path = uploads.UPLOADS_DIR / item.path
        path.parent.mkdir(exist_ok=True)
        path.write_bytes(b"fixture")
    async with posts_database() as db:
        locked = await PostMediaRepository(db).get_for_update(locked_id)
        locked.post_id = draft_id
        await db.flush()
        await asyncio.wait_for(post_media_cleanup.delete_expired_media(), timeout=5)
        await db.commit()
    assert not (uploads.UPLOADS_DIR / "posts/expired.png").exists()
    for name in ["recent.png", "draft.png", "locked.png"]:
        assert (uploads.UPLOADS_DIR / "posts" / name).exists()
    async with posts_database() as db:
        assert await db.scalar(select(func.count()).select_from(PostMedia)) == 3


async def test_cleanup_is_limited_to_one_hundred_rows(posts_database):
    old = datetime.now(UTC) - timedelta(days=2)
    async with posts_database() as db:
        db.add_all(
            [PostMedia(owner_id=1, kind="photo", path=f"posts/{i}.png", created_at=old) for i in range(105)]
        )
        await db.commit()
        removed = await PostMediaRepository(db).delete_expired(datetime.now(UTC) - timedelta(days=1), 100)
        assert len(removed) == 100
        assert await db.scalar(select(func.count()).select_from(PostMedia)) == 5


async def test_admin_reads_author_drafts_and_hidden_original_reposts(post_client):
    client = post_client
    login(client)
    original = await publish(client)
    draft = await publish(client, draft=True)
    login(client, 1)
    repost = (await client.post(f"/api/posts/{original['id']}/repost", json={})).json()
    hidden = await client.put(f"/api/internal/posts/{original['id']}/status?status=hidden", headers=ADMIN)
    assert hidden.status_code == 200
    page = (await client.get("/api/internal/posts", headers=ADMIN)).json()
    assert [post["id"] for post in page["items"]] == [repost["id"]]
    own = (await client.get("/api/internal/posts?author_id=1&status=draft", headers=ADMIN)).json()
    assert [post["id"] for post in own["items"]] == [draft["id"]]
    other = (await client.get("/api/internal/posts?author_id=2", headers=ADMIN)).json()
    assert [post["id"] for post in other["items"]] == [repost["id"]]
    assert (
        await client.put(f"/api/internal/posts/{draft['id']}/status?status=hidden", headers=ADMIN)
    ).status_code == 404
    assert (await client.get(f"/api/posts/{draft['id']}")).status_code == 404
    detail = await client.get(f"/api/internal/posts/{draft['id']}", headers=ADMIN)
    assert detail.status_code == 200
    assert detail.json()["status"] == "draft"
    assert (await client.get(f"/api/internal/posts/{draft['id']}")).status_code == 422


async def test_admin_dismisses_reports_and_deletes_comment_threads(post_client):
    client = post_client
    login(client)
    post = await publish(client)
    first = (await client.post(f"/api/posts/{post['id']}/comments", json={"text": "Комментарий"})).json()
    login(client, 1)
    await client.post(f"/api/posts/{post['id']}/comments", json={"text": "Ответ", "reply_to_id": first["id"]})
    for reason in ["Причина один", "Причина два"]:
        assert (
            await client.post(f"/api/posts/comments/{first['id']}/report", json={"reason": reason})
        ).status_code == 204
    reports = (await client.get("/api/internal/posts/reports", headers=ADMIN)).json()
    assert reports["total"] == 1
    assert reports["items"][0]["comment"]["post_id"] == post["id"]
    report_id = reports["items"][0]["id"]
    assert (
        await client.post(f"/api/internal/posts/reports/{report_id}/dismiss", headers=ADMIN)
    ).status_code == 204
    reports = (await client.get("/api/internal/posts/reports?status=resolved", headers=ADMIN)).json()
    assert reports["total"] == 1
    assert (
        await client.post(f"/api/posts/comments/{first['id']}/report", json={"reason": "Снова"})
    ).status_code == 204
    assert (await client.get("/api/internal/posts/reports", headers=ADMIN)).json()["total"] == 1
    assert (
        await client.delete(f"/api/internal/posts/comments/{first['id']}", headers=ADMIN)
    ).status_code == 204
    assert (await client.get(f"/api/posts/{post['id']}/comments")).json()["comments_count"] == 0
    assert (await client.get("/api/internal/posts/reports?status=resolved", headers=ADMIN)).json()[
        "total"
    ] == 0


async def test_admin_deletes_original_reposts_and_their_media(post_client):
    from app.poster.media.services import storage as uploads

    client = post_client
    login(client)
    media = (await client.post("/api/posts/media", files=photo())).json()
    original = await publish(client, media_ids=[media["id"]])
    login(client, 1)
    repost = (await client.post(f"/api/posts/{original['id']}/repost", json={})).json()
    edited = await client.put(f"/api/posts/{repost['id']}", json={"html": "Репост"})
    assert edited.status_code == 422
    denied = await client.delete(
        f"/api/internal/posts/{original['id']}", headers={"x-internal-token": "wrong"}
    )
    assert denied.status_code == 401
    assert (await client.delete(f"/api/internal/posts/{original['id']}", headers=ADMIN)).status_code == 204
    assert (await client.get(f"/api/posts/{original['id']}")).status_code == 404
    assert (await client.get(f"/api/posts/{repost['id']}")).status_code == 404
    assert not (uploads.UPLOADS_DIR / media["url"].removeprefix("/uploads/")).exists()


async def test_concurrent_comment_likes_preserve_counter(post_client, posts_database):
    from app.poster.comments.services.repo import CommentLikeRepository, PostCommentRepository

    client = post_client
    login(client)
    post = await publish(client)
    comment = (await client.post(f"/api/posts/{post['id']}/comments", json={"text": "Комментарий"})).json()
    inserted = asyncio.Event()

    async def second_like():
        async with posts_database() as db:
            await CommentLikeRepository(db).add(3, comment["id"])
            inserted.set()
            count = await PostCommentRepository(db).refresh_likes(comment["id"])
            await db.commit()
            return count

    async with posts_database() as db:
        await CommentLikeRepository(db).add(2, comment["id"])
        assert await PostCommentRepository(db).refresh_likes(comment["id"]) == 1
        second = asyncio.create_task(second_like())
        await asyncio.wait_for(inserted.wait(), timeout=5)
        with pytest.raises(TimeoutError):
            await asyncio.wait_for(asyncio.shield(second), timeout=0.1)
        await db.commit()
    assert await asyncio.wait_for(second, timeout=5) == 2


async def test_text_limit_is_enforced_for_creation_update_and_repost(post_client):
    """API не принимает обход ограничения редактора прямым запросом."""
    client = post_client
    login(client)
    accepted = "<p>" + "&amp;" * 5000 + "</p>"
    post = await publish(client, html=accepted)
    too_long = "<p>" + "я" * 5001 + "</p>"
    for method, url in [
        (client.post, "/api/posts"),
        (client.put, f"/api/posts/{post['id']}"),
        (client.post, f"/api/posts/{post['id']}/repost"),
    ]:
        response = await method(url, json={"html": too_long})
        assert response.status_code == 422, response.text
        assert "5000" in response.json()["detail"]
    assert (await client.get(f"/api/posts/{post['id']}")).json()["html"] == accepted


async def test_upload_removes_file_when_insert_fails(post_client, posts_database, monkeypatch):
    """Ошибка записи загрузки в базу не оставляет файл, о котором база ничего не знает."""
    from fastapi import UploadFile
    from sqlalchemy.exc import SQLAlchemyError

    from app.poster.media.services import storage as uploads
    from app.poster.media.services.usecases.upload_media import UploadMediaUseCase
    from models.account import Account

    async def failed_flush():
        raise SQLAlchemyError("Тестовая ошибка записи")

    async with posts_database() as db:
        user = await db.get(Account, 1)
        monkeypatch.setattr(db, "flush", failed_flush)
        content = photo()["file"][1]
        with pytest.raises(SQLAlchemyError):
            await UploadMediaUseCase(PostMediaRepository(db)).execute(
                user, UploadFile(file=BytesIO(content), filename="photo.png")
            )
        await db.rollback()
    assert list((uploads.UPLOADS_DIR / "posts").iterdir()) == []
    async with posts_database() as db:
        assert await db.scalar(select(func.count()).select_from(PostMedia)) == 0


async def test_author_update_cannot_undo_concurrent_moderation(post_client, posts_database):
    """Устаревшая открытая форма не превращает скрытый модератором пост в черновик."""
    from app.core.telegram import get_telegram_api
    from app.poster.channels.services.repo import ChannelRepository
    from app.poster.delivery.services.publisher import TelegramPublisher
    from app.poster.delivery.services.usecases.edit_messages import EditMessagesUseCase
    from app.poster.publications.schemas import PostSaveSchema
    from app.poster.publications.services.post_form import PostForm
    from app.poster.publications.services.repo import PostRepository
    from app.poster.publications.services.usecases.update_post import UpdatePostUseCase

    login(post_client)
    saved = await publish(post_client)
    async with posts_database() as db:
        posts = PostRepository(db)
        stale = await posts.get_by_id(saved["id"])
        assert stale.status == PostStatus.PUBLISHED
        response = await post_client.put(
            f"/api/internal/posts/{saved['id']}/status?status=hidden", headers=ADMIN
        )
        assert response.status_code == 200
        updated = await UpdatePostUseCase(
            posts,
            PostForm(PostMediaRepository(db), ChannelRepository(db), posts),
            EditMessagesUseCase(TelegramPublisher(get_telegram_api())),
        ).execute(
            stale, PostSaveSchema(html="Изменено автором", draft=True)
        )
        assert updated.status == PostStatus.HIDDEN
        await db.commit()
    assert (await post_client.get("/api/posts/feed")).json()["total"] == 0
