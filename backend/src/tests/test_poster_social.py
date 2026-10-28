"""Реакции, подписки, ленты, комментарии, жалобы, шаблоны, ИИ-помощник и каналы."""

from typing import Any

import httpx
import pytest

from src.core.database import SessionLocal
from src.poster.channels.models import PosterChannel
from src.tests.conftest import FakeTelegram, UserClientFactory

pytestmark = pytest.mark.asyncio(loop_scope="session")


async def publish(client: httpx.AsyncClient, html: str = "<p>Пост</p>") -> dict[str, Any]:
    """Публикует пост от имени клиента и возвращает его."""
    response = await client.post("/posts", json={"html": html})
    assert response.status_code == 201, response.text

    return response.json()


async def test_likes_saves_and_views(user_client: UserClientFactory, guest: httpx.AsyncClient) -> None:
    """Лайк и сохранение считаются один раз, просмотр — раз в день и не от автора."""
    _, author = await user_client("Автор")
    _, reader = await user_client("Читатель")
    post = await publish(author)

    first_like = await reader.post(f"/posts/{post['id']}/like")
    second_like = await reader.post(f"/posts/{post['id']}/like")
    assert first_like.json() == {"likes_count": 1, "liked": True}
    assert second_like.json() == {"likes_count": 1, "liked": True}
    assert (await reader.delete(f"/posts/{post['id']}/like")).json() == {"likes_count": 0, "liked": False}

    assert (await reader.post(f"/posts/{post['id']}/save")).status_code == 204
    saved = (await reader.get("/posts/saved")).json()
    assert [item["id"] for item in saved["items"]] == [post["id"]]
    assert saved["items"][0]["saved"] is True
    await reader.delete(f"/posts/{post['id']}/save")
    assert (await reader.get("/posts/saved")).json()["total"] == 0

    await author.post(f"/posts/{post['id']}/view")
    await reader.post(f"/posts/{post['id']}/view")
    await reader.post(f"/posts/{post['id']}/view")
    await guest.post(f"/posts/{post['id']}/view")
    assert (await guest.get(f"/posts/{post['id']}")).json()["views_count"] == 2


async def test_follow_and_following_feed(user_client: UserClientFactory) -> None:
    """После подписки новые посты автора появляются в ленте подписок и в счётчике новых."""
    author_account, author = await user_client("Блогер")
    _, reader = await user_client("Подписчик")

    assert (await reader.post(f"/posts/authors/{author_account.id}/follow")).status_code == 204
    self_follow = await author.post(f"/posts/authors/{author_account.id}/follow")
    assert self_follow.status_code == 400

    post = await publish(author, "<p>Для подписчиков</p>")

    unseen = await reader.get("/posts/feed/following/unseen")
    assert unseen.json() == {"count": 1}

    following = (await reader.get("/posts/feed/following")).json()
    assert [item["id"] for item in following["items"]] == [post["id"]]
    assert following["items"][0]["following"] is True
    assert (await reader.get("/posts/feed/following/unseen")).json() == {"count": 0}

    await reader.delete(f"/posts/authors/{author_account.id}/follow")
    assert (await reader.get("/posts/feed/following")).json()["total"] == 0


async def test_feeds(user_client: UserClientFactory, guest: httpx.AsyncClient) -> None:
    """Общая лента, страница автора, мои посты, черновики, репосты и карта сайта."""
    author_account, author = await user_client("Лента")
    _, reader = await user_client("Зритель")
    post = await publish(author, "<p>В ленту</p>")
    draft = (await author.post("/posts", json={"html": "<p>Черновик</p>", "draft": True})).json()
    await reader.post(f"/posts/{post['id']}/repost", json={"html": ""})

    feed_ids = [item["id"] for item in (await guest.get("/posts/feed?limit=100")).json()["items"]]
    assert post["id"] in feed_ids
    assert draft["id"] not in feed_ids

    author_page = (await guest.get(f"/posts/author/{author_account.id}")).json()
    assert [item["id"] for item in author_page["items"]] == [post["id"]]

    drafts = (await author.get("/posts/my?status=draft")).json()
    assert [item["id"] for item in drafts["items"]] == [draft["id"]]

    reposts = (await reader.get("/posts/reposts")).json()
    assert reposts["items"][0]["repost_of"]["id"] == post["id"]

    sitemap_ids = [item["id"] for item in (await guest.get("/posts/sitemap")).json()]
    assert post["id"] in sitemap_ids
    assert draft["id"] not in sitemap_ids


async def test_comments(user_client: UserClientFactory, guest: httpx.AsyncClient) -> None:
    """Комментарии собираются в ветки, счётчик поста верный, удаление ветки убирает и ответы."""
    _, author = await user_client("Хозяин")
    _, first = await user_client("Первый")
    _, second = await user_client("Второй")
    post = await publish(author)

    root = (await first.post(f"/posts/{post['id']}/comments", json={"text": " Вопрос "})).json()
    assert root["text"] == "Вопрос"
    reply_data = {"text": "Ответ", "reply_to_id": root["id"]}
    reply = await second.post(f"/posts/{post['id']}/comments", json=reply_data)
    assert reply.status_code == 201, reply.text
    assert reply.json()["parent_id"] == root["id"]
    assert reply.json()["reply_to_name"] == "Первый"

    like = await second.post(f"/posts/comments/{root['id']}/like")
    assert like.json() == {"likes_count": 1, "liked": True}

    threads = (await guest.get(f"/posts/{post['id']}/comments")).json()
    assert threads["total"] == 1
    assert threads["comments_count"] == 2
    assert [item["id"] for item in threads["items"][0]["replies"]] == [reply.json()["id"]]

    edited = await first.put(f"/posts/comments/{root['id']}", json={"text": "Уточнённый вопрос"})
    assert edited.json()["text"] == "Уточнённый вопрос"
    assert (await second.put(f"/posts/comments/{root['id']}", json={"text": "чужой"})).status_code == 404

    assert (await first.delete(f"/posts/comments/{root['id']}")).status_code == 204
    after = (await guest.get(f"/posts/{post['id']}/comments")).json()
    assert after["total"] == 0
    assert after["comments_count"] == 0


async def test_reports_and_moderation(
    user_client: UserClientFactory,
    guest: httpx.AsyncClient,
    admin: httpx.AsyncClient,
) -> None:
    """Жалоба видна модератору, скрытие поста закрывает жалобы и убирает пост с сайта."""
    _, author = await user_client("Нарушитель")
    _, reporter = await user_client("Бдительный")
    post = await publish(author, "<p>Спорно</p>")
    commented = await author.post(f"/posts/{post['id']}/comments", json={"text": "Спорный комментарий"})
    comment = commented.json()

    assert (await reporter.post(f"/posts/{post['id']}/report", json={"reason": "Спам"})).status_code == 204
    repeated = await reporter.post(f"/posts/{post['id']}/report", json={"reason": "Спам ещё"})
    assert repeated.status_code == 204
    report_comment = await reporter.post(f"/posts/comments/{comment['id']}/report", json={"reason": "Грубо"})
    assert report_comment.status_code == 204

    reports = (await admin.get("/internal/posts/reports")).json()
    our_reports = [item for item in reports["items"] if item["reporter"]["name"] == "Бдительный"]
    assert len(our_reports) == 2

    hidden = await admin.put(f"/internal/posts/{post['id']}/status?status=hidden")
    assert hidden.status_code == 200, hidden.text
    assert hidden.json()["status"] == "hidden"
    assert (await guest.get(f"/posts/{post['id']}")).status_code == 404

    comment_report = next(item for item in our_reports if item["comment"] is not None)
    assert (await admin.post(f"/internal/posts/reports/{comment_report['id']}/dismiss")).status_code == 204

    still_open = (await admin.get("/internal/posts/reports")).json()["items"]
    assert not [item for item in still_open if item["reporter"]["name"] == "Бдительный"]

    assert (await guest.get("/internal/posts/reports")).status_code == 422


async def test_templates_and_ai(user_client: UserClientFactory) -> None:
    """Шаблон сохраняется, виден и удаляется, ИИ-помощник возвращает чистый текст."""
    _, client = await user_client("Шаблонщик")

    template = {"title": "Анонс", "html": "<p>Заготовка<script>x</script></p>"}
    saved = await client.post("/poster/templates", json=template)
    assert saved.status_code == 201, saved.text
    assert saved.json()["html"] == "<p>Заготовка</p>"
    assert [item["title"] for item in (await client.get("/poster/templates")).json()] == ["Анонс"]
    assert (await client.delete(f"/poster/templates/{saved.json()['id']}")).status_code == 204

    answer = await client.post("/posts/assistant", json={"instruction": "Напиши анонс", "html": ""})
    assert answer.status_code == 200, answer.text
    assert answer.json() == {"html": "<p>Текст от ИИ</p>"}


async def test_channels(user_client: UserClientFactory, telegram: FakeTelegram) -> None:
    """Свои каналы видны, обновляются у Telegram и отключаются."""
    account, client = await user_client("Каналовод")

    async with SessionLocal() as db:
        channel = PosterChannel(owner_id=account.id, chat_id=-1009, kind="channel", title="Старое имя")
        db.add(channel)
        await db.commit()

    listed = (await client.get("/poster/channels")).json()
    assert [item["title"] for item in listed] == ["Старое имя"]

    refreshed = await client.post(f"/poster/channels/{channel.id}/refresh")
    assert refreshed.json()["title"] == "Тестовый канал"
    assert refreshed.json()["can_post"] is True

    telegram.calls.clear()
    assert (await client.delete(f"/poster/channels/{channel.id}")).status_code == 204
    assert telegram.methods() == ["leaveChat"]
    assert (await client.get("/poster/channels")).json() == []
