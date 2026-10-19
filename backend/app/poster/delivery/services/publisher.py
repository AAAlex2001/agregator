"""Отправка, правка и удаление поста в Telegram-чате."""

from pathlib import Path
from typing import Any

from app.core.telegram import TelegramApi, TelegramReply
from app.core.uploads import UPLOADS_DIR
from app.poster.delivery.services.telegram_markup import to_telegram
from app.poster.media.models import MediaKind, PostMedia
from app.poster.publications.models import Post

HTML_MODE = "HTML"


def attachment_name(position: int) -> str:
    """Имя файла в запросе: attach://file0, attach://file1…"""

    return f"file{position}"


def files_of(media: list[PostMedia]) -> dict[str, Path]:
    """Файлы поста с диска под именами для multipart."""

    return {attachment_name(position): UPLOADS_DIR / item.path for position, item in enumerate(media)}


def single_media_request(item: PostMedia, caption: str) -> tuple[str, dict[str, Any]]:
    """Одно фото или видео с подписью."""

    field = "photo" if item.kind == MediaKind.PHOTO else "video"
    method = "sendPhoto" if item.kind == MediaKind.PHOTO else "sendVideo"

    return method, {field: f"attach://{attachment_name(0)}", "caption": caption, "parse_mode": HTML_MODE}


def album_request(media: list[PostMedia], caption: str) -> tuple[str, dict[str, Any]]:
    """Альбом: подпись у первого файла."""

    album: list[dict[str, Any]] = [
        {"type": item.kind, "media": f"attach://{attachment_name(position)}"}
        for position, item in enumerate(media)
    ]
    album[0] |= {"caption": caption, "parse_mode": HTML_MODE}

    return "sendMediaGroup", {"media": album}


def message_ids(result: Any) -> list[int]:
    """id отправленных сообщений: у альбома их несколько."""

    if isinstance(result, list):
        return [message["message_id"] for message in result]

    return [result["message_id"]]


class TelegramPublisher:
    """Говорит с Telegram от имени бота: шлёт, правит и удаляет сообщения поста."""

    def __init__(self, api: TelegramApi) -> None:
        self.api = api

    async def send(self, post: Post, chat_id: int) -> TelegramReply:
        """Пост в чат. Успешный результат — список id сообщений."""

        text = to_telegram(post.html)

        if not post.media:
            reply = await self.api.call("sendMessage", {"chat_id": chat_id, "text": text, "parse_mode": HTML_MODE})
        elif len(post.media) == 1:
            method, payload = single_media_request(post.media[0], text)
            reply = await self.api.upload(method, {"chat_id": chat_id, **payload}, files_of(post.media))
        else:
            method, payload = album_request(post.media, text)
            reply = await self.api.upload(method, {"chat_id": chat_id, **payload}, files_of(post.media))

        if reply.ok:
            reply.result = message_ids(reply.result)

        return reply

    async def edit(self, post: Post, chat_id: int, message_id: int) -> TelegramReply:
        """Новый текст поста: у сообщения с медиа меняется подпись."""

        text = to_telegram(post.html)
        target = {"chat_id": chat_id, "message_id": message_id, "parse_mode": HTML_MODE}

        if post.media:
            return await self.api.call("editMessageCaption", {**target, "caption": text})

        return await self.api.call("editMessageText", {**target, "text": text})

    async def delete(self, chat_id: int, ids: list[int]) -> TelegramReply:
        """Удаляет сообщения поста из чата."""

        return await self.api.call("deleteMessages", {"chat_id": chat_id, "message_ids": ids})
