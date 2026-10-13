"""Полный цикл публикаций через API без обращения к рабочим данным."""

from io import BytesIO

import pytest
from PIL import Image

from models.posts import Post, PostStatus

pytestmark = pytest.mark.integration


def login(client, index=0):
    """Выбирает одну из трёх тестовых сессий."""
    client.cookies.clear()
    client.cookies.set("session_id", f"posts-test-{index}")


async def publish(client, html="<p>Публикация</p>", **fields):
    """Создаёт тестовую публикацию через обычный API."""
    result = await client.post("/api/posts", json={"html": html, **fields})
    assert result.status_code == 201, result.text
    return result.json()


async def test_guest_and_draft_access(post_client):
    client = post_client
    assert (await client.get("/api/posts/feed")).status_code == 200
    assert (await client.post("/api/posts", json={"html": "Текст"})).status_code == 401
    login(client)
    post = await publish(client, draft=True)
    post_id = post["id"]
    assert post["status"] == "draft"
    assert (await client.get(f"/api/posts/{post_id}")).status_code == 200
    login(client, 1)
    assert (await client.get(f"/api/posts/{post_id}")).status_code == 404
    assert (await client.put(f"/api/posts/{post_id}", json={"html": "Чужая правка"})).status_code == 404
    assert (await client.delete(f"/api/posts/{post_id}")).status_code == 404
    assert (await client.get("/api/posts/feed")).json()["total"] == 0
    assert (await client.post(f"/api/posts/{post_id}/like")).status_code == 404
    login(client)
    changed = await client.put(f"/api/posts/{post_id}", json={"html": "<p>Опубликовано</p>"})
    assert changed.status_code == 200, changed.text
    assert (await client.get("/api/posts/my/counts")).json() == {"published": 1, "draft": 0, "hidden": 0}


async def test_likes_saves_reposts_comments_and_views(post_client):
    client = post_client
    login(client)
    post = await publish(client, '<p onclick="steal()">Текст<script>alert(1)</script></p>')
    post_id = post["id"]
    assert "script" not in post["html"]
    assert "onclick" not in post["html"]
    login(client, 1)
    for _ in range(2):
        liked = await client.post(f"/api/posts/{post_id}/like")
        assert liked.json() == {"likes_count": 1, "liked": True}
        assert (await client.post(f"/api/posts/{post_id}/save")).status_code == 204
        assert (await client.post(f"/api/posts/{post_id}/view")).status_code == 204
    assert (await client.get("/api/posts/saved")).json()["total"] == 1
    repost = await client.post(f"/api/posts/{post_id}/repost", json={"html": "<p>Советую</p>"})
    assert repost.status_code == 201, repost.text
    assert repost.json()["repost_of"]["id"] == post_id
    assert (await client.get("/api/posts/reposts")).json()["total"] == 1
    comment = await client.post(f"/api/posts/{post_id}/comments", json={"text": "Комментарий"})
    assert comment.status_code == 201, comment.text
    comment_id = comment.json()["id"]
    login(client, 2)
    reply = await client.post(
        f"/api/posts/{post_id}/comments", json={"text": "Ответ", "reply_to_id": comment_id}
    )
    assert reply.status_code == 201, reply.text
    assert reply.json()["parent_id"] == comment_id
    assert reply.json()["reply_to_name"] == "Читатель"
    assert (
        await client.put(f"/api/posts/comments/{comment_id}", json={"text": "Чужая правка"})
    ).status_code == 404
    for _ in range(2):
        assert (await client.post(f"/api/posts/comments/{comment_id}/like")).json()["likes_count"] == 1
    threads = (await client.get(f"/api/posts/{post_id}/comments")).json()
    assert threads["total"] == 1
    assert threads["comments_count"] == 2
    assert len(threads["items"][0]["replies"]) == 1
    assert (
        await client.post(f"/api/posts/{post_id}/report", json={"reason": "Проверьте публикацию"})
    ).status_code == 204
    current = (await client.get(f"/api/posts/{post_id}")).json()
    assert (current["likes_count"], current["views_count"], current["reposts_count"]) == (1, 1, 1)
    login(client, 1)
    assert (await client.delete(f"/api/posts/comments/{comment_id}")).status_code == 204
    assert (await client.get(f"/api/posts/{post_id}/comments")).json()["comments_count"] == 0
    assert (await client.delete(f"/api/posts/{post_id}/like")).json()["likes_count"] == 0
    assert (await client.delete(f"/api/posts/{post_id}/save")).status_code == 204


async def test_following_feed_and_unseen(post_client):
    client = post_client
    login(client)
    first = await publish(client)
    author_id = first["author"]["id"]
    assert (await client.post(f"/api/posts/authors/{author_id}/follow")).status_code == 422
    login(client, 1)
    assert (await client.post(f"/api/posts/authors/{author_id}/follow")).status_code == 204
    assert (await client.post(f"/api/posts/authors/{author_id}/follow")).status_code == 204
    assert (await client.get("/api/posts/feed/following")).json()["total"] == 1
    assert (await client.get("/api/posts/feed/following/unseen")).json()["count"] == 0
    login(client)
    await publish(client, "<p>Новый пост</p>")
    login(client, 1)
    assert (await client.get("/api/posts/feed/following/unseen")).json()["count"] == 1
    assert (await client.post("/api/posts/feed/following/seen")).status_code == 204
    assert (await client.get("/api/posts/feed/following/unseen")).json()["count"] == 0
    assert (await client.delete(f"/api/posts/authors/{author_id}/follow")).status_code == 204
    assert (await client.get("/api/posts/feed/following")).json()["total"] == 0


async def test_media_ownership_validation_and_delete(post_client):
    client = post_client
    login(client)
    invalid = await client.post(
        "/api/posts/media", files={"file": ("fake.jpg", b"<script>bad</script>", "image/jpeg")}
    )
    assert invalid.status_code == 422
    output = BytesIO()
    Image.new("RGB", (2, 2), "orange").save(output, format="PNG")
    uploaded = await client.post(
        "/api/posts/media", files={"file": ("photo.png", output.getvalue(), "image/png")}
    )
    assert uploaded.status_code == 201, uploaded.text
    media_id = uploaded.json()["id"]
    login(client, 1)
    assert (await client.delete(f"/api/posts/media/{media_id}")).status_code == 404
    assert (await client.post("/api/posts", json={"media_ids": [media_id]})).status_code == 422
    login(client)
    post = await publish(client, "", media_ids=[media_id])
    assert post["media"][0]["id"] == media_id
    assert (await client.delete(f"/api/posts/media/{media_id}")).status_code == 404
    assert (await client.post("/api/posts", json={"media_ids": [media_id]})).status_code == 422
    assert (await client.delete(f"/api/posts/{post['id']}")).status_code == 204


async def test_hidden_original_and_comments_are_not_exposed(post_client, posts_database):
    client = post_client
    login(client)
    original = await publish(client)
    post_id = original["id"]
    login(client, 1)
    comment = (await client.post(f"/api/posts/{post_id}/comments", json={"text": "Текст"})).json()
    repost = (await client.post(f"/api/posts/{post_id}/repost", json={})).json()
    async with posts_database() as db:
        post = await db.get(Post, post_id)
        post.status = PostStatus.HIDDEN
        await db.commit()
    assert (await client.get("/api/posts/feed")).json()["total"] == 0
    assert (await client.get(f"/api/posts/{repost['id']}")).status_code == 404
    assert (await client.post(f"/api/posts/comments/{comment['id']}/like")).status_code == 404
    login(client)
    updated = await client.put(f"/api/posts/{post_id}", json={"html": "Правка"})
    assert updated.json()["status"] == "hidden"


async def test_assistant_returns_controlled_response_without_key(post_client, monkeypatch):
    from services.posts.config import get_settings

    monkeypatch.setenv("PROXYAPI_KEY", "")
    get_settings.cache_clear()
    login(post_client)
    result = await post_client.post("/api/posts/assistant", json={"instruction": "Напиши пост"})
    assert result.status_code == 503
    assert "ключ" not in result.text.lower()
    get_settings.cache_clear()


async def test_parallel_reactions_keep_counts_and_notifications(post_client, posts_database):
    """Параллельные реакции не теряют счётчики и не дублируют лайки."""
    import asyncio

    from sqlalchemy import select

    from models.account import Account
    from models.notification import Notification, NotificationType
    from services.notifications.formatters import to_response

    client = post_client
    login(client)
    post = await publish(client)
    post_id = post["id"]
    author_id = post["author"]["id"]
    requests = [
        client.post(f"/api/posts/{post_id}/like", headers={"cookie": f"session_id=posts-test-{index}"})
        for index in [1, 2, 1, 2]
    ]
    responses = await asyncio.gather(*requests)
    assert all(response.status_code == 200 for response in responses)
    current = (await client.get(f"/api/posts/{post_id}")).json()
    assert current["likes_count"] == 2

    responses = await asyncio.gather(
        *[
            client.post(
                f"/api/posts/{post_id}/comments",
                json={"text": f"Ответ {index}"},
                headers={"cookie": f"session_id=posts-test-{index}"},
            )
            for index in [1, 2]
        ]
    )
    assert all(response.status_code == 201 for response in responses)
    responses = await asyncio.gather(
        *[
            client.post(
                f"/api/posts/{post_id}/repost", json={}, headers={"cookie": f"session_id=posts-test-{index}"}
            )
            for index in [1, 2]
        ]
    )
    assert all(response.status_code == 201 for response in responses)
    current = (await client.get(f"/api/posts/{post_id}")).json()
    assert current["comments_count"] == 2
    assert current["reposts_count"] == 2
    async with posts_database() as db:
        notifications = list(
            (
                await db.execute(
                    select(Notification).where(
                        Notification.user_id == author_id, Notification.type == NotificationType.POST_ACTIVITY
                    )
                )
            ).scalars()
        )
        assert len(notifications) == 6
        assert (await db.get(Account, author_id)).notification_unread_count == 6
        assert all(to_response(item).payload.actor_name for item in notifications)


async def test_single_media_cannot_be_claimed_by_parallel_posts(post_client):
    """Одно вложение принадлежит ровно одной публикации даже при двойной отправке."""
    import asyncio

    client = post_client
    login(client)
    output = BytesIO()
    Image.new("RGB", (2, 2), "orange").save(output, format="PNG")
    uploaded = await client.post(
        "/api/posts/media", files={"file": ("photo.png", output.getvalue(), "image/png")}
    )
    assert uploaded.status_code == 201
    payload = {"media_ids": [uploaded.json()["id"]]}
    responses = await asyncio.gather(
        client.post("/api/posts", json=payload), client.post("/api/posts", json=payload)
    )
    assert sorted(response.status_code for response in responses) == [201, 422]


async def test_report_moderation_requires_internal_token(post_client):
    """Жалоба доступна модератору; скрытый пост исчезает из ленты."""
    client = post_client
    login(client)
    post = await publish(client)
    post_id = post["id"]
    login(client, 1)
    assert (
        await client.post(f"/api/posts/{post_id}/report", json={"reason": "Проверьте факты"})
    ).status_code == 204
    assert (await client.get("/api/internal/posts/reports")).status_code == 422
    assert (
        await client.get("/api/internal/posts/reports", headers={"x-internal-token": "wrong"})
    ).status_code == 401
    headers = {"x-internal-token": "posts-test-admin"}
    reports = (await client.get("/api/internal/posts/reports", headers=headers)).json()
    assert reports["total"] == 1
    response = await client.put(f"/api/internal/posts/{post_id}/status?status=hidden", headers=headers)
    assert response.status_code == 200, response.text
    assert (await client.get("/api/posts/feed")).json()["total"] == 0
    assert (await client.get("/api/internal/posts/reports", headers=headers)).json()["total"] == 0
    assert (
        await client.put(f"/api/internal/posts/{post_id}/status?status=published", headers=headers)
    ).status_code == 200
    assert (await client.get("/api/posts/feed")).json()["total"] == 1


async def test_delete_waits_for_media_attachment(post_client, posts_database):
    """Удаление ждёт сохранения поста и не удаляет уже прикреплённое фото."""
    import asyncio

    from services.posts.repo import PostMediaRepository

    client = post_client
    login(client)
    post = await publish(client)
    output = BytesIO()
    Image.new("RGB", (2, 2), "orange").save(output, format="PNG")
    uploaded = await client.post(
        "/api/posts/media", files={"file": ("photo.png", output.getvalue(), "image/png")}
    )
    assert uploaded.status_code == 201, uploaded.text
    media_id = uploaded.json()["id"]

    async with posts_database() as db:
        media = PostMediaRepository(db)
        files = await media.list_usable(post["author"]["id"], [media_id], post["id"])
        files[0].post_id = post["id"]
        await db.flush()

        deletion = asyncio.create_task(client.delete(f"/api/posts/media/{media_id}"))
        with pytest.raises(TimeoutError):
            await asyncio.wait_for(asyncio.shield(deletion), timeout=0.2)
        await db.commit()

    response = await asyncio.wait_for(deletion, timeout=5)
    assert response.status_code == 404, response.text
    saved = await client.get(f"/api/posts/{post['id']}")
    assert [item["id"] for item in saved.json()["media"]] == [media_id]


async def test_sitemap_exposes_only_published_originals(post_client, posts_database):
    """Карта сайта доступна гостям и постранично выдаёт только открытые оригиналы."""
    client = post_client
    login(client)
    first = await publish(client)
    await publish(client, draft=True)
    hidden = await publish(client)
    second = await publish(client)
    await client.post(f"/api/posts/{first['id']}/repost", json={"html": "Комментарий"})
    async with posts_database() as db:
        post = await db.get(Post, hidden["id"])
        post.status = PostStatus.HIDDEN
        await db.commit()

    client.cookies.clear()
    response = await client.get("/api/posts/sitemap", params={"limit": 1})
    assert response.status_code == 200, response.text
    assert response.json() == [{"id": first["id"], "updated_at": first["updated_at"]}]
    response = await client.get("/api/posts/sitemap", params={"after_id": first["id"], "limit": 1})
    assert response.json() == [{"id": second["id"], "updated_at": second["updated_at"]}]
    assert (await client.get("/api/posts/sitemap", params={"after_id": second["id"]})).json() == []
    assert (await client.get("/api/posts/sitemap", params={"after_id": -1})).status_code == 422
    assert (await client.get("/api/posts/sitemap", params={"limit": 5001})).status_code == 422


async def test_modified_date_changes_only_when_post_is_edited(post_client):
    """Просмотры и реакции не меняют дату редактирования для поисковиков."""
    client = post_client
    login(client)
    post = await publish(client)
    post_id = post["id"]
    await client.post(f"/api/posts/{post_id}/view")
    await client.post(f"/api/posts/{post_id}/like")
    await client.post(f"/api/posts/{post_id}/comments", json={"text": "Комментарий"})
    await client.post(f"/api/posts/{post_id}/repost", json={})
    current = (await client.get(f"/api/posts/{post_id}")).json()
    assert current["updated_at"] == post["updated_at"]

    edited = await client.put(f"/api/posts/{post_id}", json={"html": "Исправленный текст"})
    assert edited.status_code == 200, edited.text
    assert edited.json()["updated_at"] > post["updated_at"]
