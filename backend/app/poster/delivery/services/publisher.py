"""Отправка, правка и удаление поста в Telegram-чате."""

import logging
from pathlib import Path
from typing import Any

from app.core.telegram import TelegramApi, TelegramReply
from app.core.uploads import UPLOADS_DIR
from app.poster.delivery.options import TelegramOptions
from app.poster.delivery.services.telegram_markup import to_telegram
from app.poster.delivery.services.telegram_payloads import (
    delivery_flags,
    inline_keyboard,
    link_preview_options,
    poll_request,
    without_empty,
)
from app.poster.media.models import MediaKind, PostMedia
from app.poster.publications.models import Post

logger = logging.getLogger(__name__)

HTML_MODE = "HTML"


def attachment_name(position: int) -> str:
    """Имя файла в запросе: attach://file0, attach://file1…"""

    return f"file{position}"


def files_of(media: list[PostMedia]) -> dict[str, Path]:
    """Файлы поста с диска под именами для multipart."""

    return {attachment_name(position): UPLOADS_DIR / item.path for position, item in enumerate(media)}


def reply_parameters(reply_to: int | None) -> dict[str, Any]:
    """Ответ на сообщение; если его удалили, пост всё равно выходит."""

    if reply_to is None:
        return {}

    return {"reply_parameters": {"message_id": reply_to, "allow_sending_without_reply": True}}


def message_ids(result: Any) -> list[int]:
    """id отправленных сообщений: у альбома их несколько."""

    if isinstance(result, list):
        return [message["message_id"] for message in result]

    return [result["message_id"]]


class TelegramPublisher:
    """Говорит с Telegram от имени бота: шлёт, правит и удаляет сообщения поста."""

    def __init__(self, api: TelegramApi) -> None:
        self.api = api

    async def send(self, post: Post, chat_id: int, reply_to: int | None = None) -> TelegramReply:
        """Пост, затем опрос и закреп. reply_to — сообщение, на которое пост отвечает.

        Успешный результат — список id сообщений.
        """

        options = TelegramOptions.of(post.telegram)
        reply = await self.send_main(post, chat_id, options, reply_to)
        if not reply.ok:
            return reply

        ids = message_ids(reply.result) if reply.result else []

        if options.poll is not None:
            ids += await self.send_poll(chat_id, options)

        if options.pin and ids:
            await self.pin(chat_id, ids[0], options)

        return TelegramReply(result=ids)

    async def send_main(
        self,
        post: Post,
        chat_id: int,
        options: TelegramOptions,
        reply_to: int | None,
    ) -> TelegramReply:
        """Текст, одно фото или видео либо альбом. Пост из одного опроса — без сообщения."""

        text = to_telegram(post.html)
        common = {"chat_id": chat_id, **delivery_flags(options), **reply_parameters(reply_to)}

        if not post.media and not text:
            return TelegramReply(result=None)

        if not post.media:
            payload = without_empty({
                "text": text,
                "parse_mode": HTML_MODE,
                "link_preview_options": link_preview_options(options),
                "reply_markup": inline_keyboard(post.id, options) if options.buttons else None,
            })
            return await self.api.call("sendMessage", {**common, **payload})

        if len(post.media) == 1:
            method, payload = self.single_media(post, text, options)
            return await self.api.upload(method, {**common, **payload}, files_of(post.media))

        payload = {"media": self.album(post.media, text, options)}
        return await self.api.upload("sendMediaGroup", {**common, **payload}, files_of(post.media))

    def single_media(self, post: Post, caption: str, options: TelegramOptions) -> tuple[str, dict[str, Any]]:
        """Одно фото или видео с подписью и кнопками."""

        item = post.media[0]
        is_photo = item.kind == MediaKind.PHOTO
        payload = without_empty({
            "photo" if is_photo else "video": f"attach://{attachment_name(0)}",
            "caption": caption,
            "parse_mode": HTML_MODE,
            "show_caption_above_media": options.caption_above or None,
            "reply_markup": inline_keyboard(post.id, options) if options.buttons else None,
        })

        return ("sendPhoto" if is_photo else "sendVideo"), payload

    def album(self, media: list[PostMedia], caption: str, options: TelegramOptions) -> list[dict[str, Any]]:
        """Файлы альбома: подпись у первого."""

        album: list[dict[str, Any]] = [
            {"type": item.kind, "media": f"attach://{attachment_name(position)}"}
            for position, item in enumerate(media)
        ]
        album[0] |= without_empty({
            "caption": caption,
            "parse_mode": HTML_MODE,
            "show_caption_above_media": options.caption_above or None,
        })

        return album

    async def send_poll(self, chat_id: int, options: TelegramOptions) -> list[int]:
        """Опрос следом за постом. Не ушёл — пост всё равно считается отправленным."""

        if options.poll is None:
            return []

        reply = await self.api.call("sendPoll", poll_request(chat_id, options.poll, options))
        if not reply.ok:
            logger.warning("Опрос не отправлен в чат %s: %s", chat_id, reply.error)
            return []

        return message_ids(reply.result)

    async def pin(self, chat_id: int, message_id: int, options: TelegramOptions) -> None:
        """Закрепляет пост. Без права закрепа пост остаётся незакреплённым."""

        payload = {"chat_id": chat_id, "message_id": message_id, **delivery_flags(options)}
        reply = await self.api.call("pinChatMessage", payload)

        if not reply.ok:
            logger.warning("Пост не закреплён в чате %s: %s", chat_id, reply.error)

    async def edit(self, post: Post, chat_id: int, message_id: int) -> TelegramReply:
        """Новый текст и кнопки: у сообщения с медиа меняется подпись. У альбома кнопок нет."""

        options = TelegramOptions.of(post.telegram)
        text = to_telegram(post.html)
        if not post.media and not text:
            return TelegramReply(result=True)

        target = without_empty({
            "chat_id": chat_id,
            "message_id": message_id,
            "parse_mode": HTML_MODE,
            "reply_markup": inline_keyboard(post.id, options) if len(post.media) <= 1 else None,
        })

        if post.media:
            return await self.api.call("editMessageCaption", {**target, "caption": text})

        preview = without_empty({"link_preview_options": link_preview_options(options)})

        return await self.api.call("editMessageText", {**target, **preview, "text": text})

    async def delete(self, chat_id: int, ids: list[int]) -> TelegramReply:
        """Удаляет сообщения поста из чата."""

        return await self.api.call("deleteMessages", {"chat_id": chat_id, "message_ids": ids})
