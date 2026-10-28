"""Посты: создание, отправка в канал, правка, отложенная публикация, удаление, репост и файлы."""

from datetime import UTC, datetime, timedelta
from io import BytesIO

import pytest
from PIL import Image
from sqlalchemy import select, update

from src.core.database import SessionLocal
from src.poster.channels.models import PosterChannel
from src.poster.delivery.models import PostDelivery
from src.poster.delivery.tasks import send_ready_posts
from src.poster.posts.models import Post, PostMedia
from src.poster.posts.tasks import delete_unused_media, publish_scheduled_posts

pytestmark = pytest.mark.asyncio(loop_scope="session")


def png_bytes() -> bytes:
    """Возвращает маленькое настоящее PNG-фото."""
    image = Image.new("RGB", (8, 8), "red")
    output = BytesIO()
    image.save(output, format="PNG")

    return output.getvalue()


async def create_channel(owner_id: int) -> int:
    """Подключает автору канал, в который бот может публиковать, и возвращает его id."""
    async with SessionLocal() as db:
        channel = PosterChannel(
            owner_id=owner_id,
            chat_id=-1001234567890,
            kind="channel",
            title="Канал",
            username="test_channel",
            can_post=True,
        )
        db.add(channel)
        await db.commit()

        return channel.id


async def upload_photo(client) -> int:
    """Загружает фото в редактор и возвращает id файла."""
    response = await client.post("/posts/media", files={"file": ("photo.png", png_bytes(), "image/png")})
    assert response.status_code == 201, response.text
    assert response.json()["kind"] == "photo"

    return response.json()["id"]


async def test_post_goes_to_channel_and_is_edited(user_client, guest, telegram) -> None:
    """Пост с фото уходит в канал, а после правки текст меняется и в канале."""
    author, client = await user_client("Автор")
    channel_id = await create_channel(author.id)
    media_id = await upload_photo(client)

    created = await client.post(
        "/posts",
        json={"html": "<p>Первый <strong>пост</strong></p>", "media_ids": [media_id], "channel_ids": [channel_id]},
    )
    assert created.status_code == 201, created.text
    post = created.json()
    assert post["status"] == "published"
    assert post["deliveries"][0]["status"] == "pending"
    assert post["cover_url"] == post["media"][0]["url"]

    telegram.calls.clear()
    await send_ready_posts()
    assert telegram.methods() == ["sendPhoto"]
    assert telegram.calls[0][1]["caption"] == "Первый <b>пост</b>"

    seen_by_author = (await client.get(f"/posts/{post['id']}")).json()
    assert seen_by_author["deliveries"][0]["status"] == "sent"
    assert seen_by_author["deliveries"][0]["message_url"].startswith("https://t.me/test_channel/")

    seen_by_guest = await guest.get(f"/posts/{post['id']}")
    assert seen_by_guest.status_code == 200
    assert seen_by_guest.json()["deliveries"] == []

    telegram.calls.clear()
    edited = await client.put(
        f"/posts/{post['id']}",
        json={"html": "<p>Исправлено</p>", "media_ids": [media_id], "channel_ids": [channel_id]},
    )
    assert edited.status_code == 200, edited.text
    assert telegram.methods() == ["editMessageCaption"]

    changed_media = await client.put(
        f"/posts/{post['id']}",
        json={"html": "<p>Без фото</p>", "media_ids": [], "channel_ids": [channel_id]},
    )
    assert changed_media.status_code == 400
    assert "менять нельзя" in changed_media.json()["detail"]


async def test_failed_delivery_is_retried_after_save(user_client, telegram) -> None:
    """Неудачная отправка снова встаёт в очередь, когда автор сохраняет пост ещё раз."""
    author, client = await user_client("Повтор")
    channel_id = await create_channel(author.id)
    created = await client.post("/posts", json={"html": "<p>Текст</p>", "channel_ids": [channel_id]})
    post_id = created.json()["id"]

    async with SessionLocal() as db:
        await db.execute(update(PostDelivery).where(PostDelivery.post_id == post_id).values(status="failed"))
        await db.commit()

    await client.put(f"/posts/{post_id}", json={"html": "<p>Текст</p>", "channel_ids": [channel_id]})

    async with SessionLocal() as db:
        statuses = list(await db.scalars(select(PostDelivery.status).where(PostDelivery.post_id == post_id)))

    assert statuses == ["pending"]


async def test_scheduled_post_is_published_by_worker(user_client, guest) -> None:
    """Отложенный пост не виден гостю, пока worker его не опубликует."""
    _, client = await user_client("Планировщик")
    later = (datetime.now(UTC) + timedelta(hours=1)).isoformat()

    created = await client.post("/posts", json={"html": "<p>Позже</p>", "scheduled_at": later})
    post = created.json()
    assert post["status"] == "scheduled"
    assert (await guest.get(f"/posts/{post['id']}")).status_code == 404

    async with SessionLocal() as db:
        past = datetime.now(UTC) - timedelta(minutes=1)
        await db.execute(update(Post).where(Post.id == post["id"]).values(scheduled_at=past))
        await db.commit()

    await publish_scheduled_posts()

    published = await guest.get(f"/posts/{post['id']}")
    assert published.status_code == 200
    assert published.json()["status"] == "published"


async def test_post_checks(user_client) -> None:
    """Пустой пост, пост в никуда и время в прошлом отклоняются."""
    _, client = await user_client("Проверка")

    empty = await client.post("/posts", json={"html": "<p> </p>"})
    assert empty.status_code == 400

    nowhere = await client.post("/posts", json={"html": "<p>Текст</p>", "on_site": False})
    assert nowhere.status_code == 400

    past = (datetime.now(UTC) - timedelta(hours=1)).isoformat()
    in_past = await client.post("/posts", json={"html": "<p>Текст</p>", "scheduled_at": past})
    assert in_past.status_code == 400


async def test_delete_post_from_channels(user_client, telegram) -> None:
    """Удалённый пост пропадает с сайта и, если попросили, из канала."""
    author, client = await user_client("Удалятор")
    channel_id = await create_channel(author.id)
    created = await client.post("/posts", json={"html": "<p>Уйдёт</p>", "channel_ids": [channel_id]})
    post_id = created.json()["id"]
    await send_ready_posts()

    telegram.calls.clear()
    deleted = await client.delete(f"/posts/{post_id}?from_channels=true")
    assert deleted.status_code == 204
    assert telegram.methods() == ["deleteMessages"]
    assert (await client.get(f"/posts/{post_id}")).status_code == 404


async def test_repost_counts(user_client) -> None:
    """Репост прибавляет счётчик у оригинала, а удаление репоста — убавляет."""
    _, author = await user_client("Оригинал")
    _, reader = await user_client("Читатель")
    original = (await author.post("/posts", json={"html": "<p>Оригинал</p>"})).json()

    repost = await reader.post(f"/posts/{original['id']}/repost", json={"html": "<p>Смотрите</p>"})
    assert repost.status_code == 201, repost.text
    assert repost.json()["repost_of"]["id"] == original["id"]
    assert (await author.get(f"/posts/{original['id']}")).json()["reposts_count"] == 1

    await reader.delete(f"/posts/{repost.json()['id']}")
    assert (await author.get(f"/posts/{original['id']}")).json()["reposts_count"] == 0


async def test_media_upload_delete_and_cleanup(user_client, app) -> None:
    """Загруженный файл можно удалить, а брошенный убирает worker."""
    _, client = await user_client("Файлы")

    media_id = await upload_photo(client)
    assert (await client.delete(f"/posts/media/{media_id}")).status_code == 204

    wrong = await client.post("/posts/media", files={"file": ("note.txt", b"hello", "text/plain")})
    assert wrong.status_code == 400

    abandoned_id = await upload_photo(client)

    async with SessionLocal() as db:
        old = datetime.now(UTC) - timedelta(days=2)
        await db.execute(update(PostMedia).where(PostMedia.id == abandoned_id).values(created_at=old))
        await db.commit()

    await delete_unused_media()

    async with SessionLocal() as db:
        assert await db.get(PostMedia, abandoned_id) is None


async def test_telegram_preview(user_client) -> None:
    """Предпросмотр показывает разметку Telegram и лимит."""
    _, client = await user_client("Превью")

    response = await client.post("/poster/telegram-preview", json={"html": "<h2>Заголовок</h2><p>Текст</p>"})

    assert response.status_code == 200
    assert response.json() == {"html": "<b>Заголовок</b>\n\nТекст", "length": 15, "limit": 4096}
