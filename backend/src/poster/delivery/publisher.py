from contextlib import suppress
from typing import Any

from src.core.config import UPLOADS_DIR
from src.core.telegram import TelegramClient, TelegramError
from src.poster.delivery.schemas import ButtonKind, LinkPreview, TelegramButton, TelegramOptions
from src.poster.delivery.telegram_text import to_telegram_html
from src.poster.posts.models import Post


class TelegramPublisher:
    """Отправляет пост в Telegram-чат, правит его текст и удаляет его."""

    def __init__(self, telegram: TelegramClient) -> None:
        """Запоминает клиент бота."""
        self.telegram = telegram

    async def send(self, post: Post, chat_id: int, reply_to_message_id: int | None) -> list[int]:
        """Отправляет пост в чат и возвращает id сообщений. Сбой опроса или закрепления не отменяет пост."""
        options = TelegramOptions.model_validate(post.telegram)
        text = to_telegram_html(post.html)
        common = {
            "chat_id": chat_id,
            "disable_notification": options.silent,
            "protect_content": options.protect,
        }

        if reply_to_message_id is not None:
            common["reply_parameters"] = {
                "message_id": reply_to_message_id,
                "allow_sending_without_reply": True,
            }

        message_ids = []

        if len(post.media) > 1:
            message_ids += await self.send_album(post, text, options, common)
        elif len(post.media) == 1:
            message_ids.append(await self.send_one_media(post, text, options, common))
        elif text:
            message_ids.append(await self.send_text(post, text, options, common))

        if options.poll is not None:
            with suppress(TelegramError):
                poll_message = await self.telegram.call(
                    "sendPoll",
                    {
                        **common,
                        "question": options.poll.question,
                        "options": [{"text": option} for option in options.poll.options],
                        "is_anonymous": options.poll.is_anonymous,
                        "allows_multiple_answers": options.poll.allows_multiple_answers,
                    },
                )
                message_ids.append(poll_message["message_id"])

        if options.pin and message_ids:
            with suppress(TelegramError):
                await self.telegram.call(
                    "pinChatMessage",
                    {"chat_id": chat_id, "message_id": message_ids[0], "disable_notification": True},
                )

        return message_ids

    async def send_text(
        self,
        post: Post,
        text: str,
        options: TelegramOptions,
        common: dict[str, Any],
    ) -> int:
        """Отправляет пост без фото и видео обычным сообщением с кнопками."""
        payload = {
            **common,
            "text": text,
            "parse_mode": "HTML",
            "link_preview_options": link_preview_options(options),
        }

        if options.buttons:
            payload["reply_markup"] = keyboard(post.id, options.buttons)

        message = await self.telegram.call("sendMessage", payload)

        return message["message_id"]

    async def send_one_media(
        self,
        post: Post,
        text: str,
        options: TelegramOptions,
        common: dict[str, Any],
    ) -> int:
        """Отправляет одно фото или видео с подписью и кнопками."""
        media = post.media[0]
        payload = {
            **common,
            "caption": text,
            "parse_mode": "HTML",
            "show_caption_above_media": options.caption_above,
        }

        if options.buttons:
            payload["reply_markup"] = keyboard(post.id, options.buttons)

        files = {"file": UPLOADS_DIR / media.path}

        if media.kind == "photo":
            payload["photo"] = "attach://file"
            message = await self.telegram.upload("sendPhoto", payload, files)
        else:
            payload["video"] = "attach://file"
            message = await self.telegram.upload("sendVideo", payload, files)

        return message["message_id"]

    async def send_album(
        self,
        post: Post,
        text: str,
        options: TelegramOptions,
        common: dict[str, Any],
    ) -> list[int]:
        """Отправляет альбом. Подпись — у первого файла. Кнопки к альбому Telegram не прикрепляет."""
        album = []
        files = {}

        for position, media in enumerate(post.media):
            album.append({"type": media.kind, "media": f"attach://file{position}"})
            files[f"file{position}"] = UPLOADS_DIR / media.path

        album[0]["caption"] = text
        album[0]["parse_mode"] = "HTML"
        album[0]["show_caption_above_media"] = options.caption_above

        messages = await self.telegram.upload("sendMediaGroup", {**common, "media": album}, files)

        return [message["message_id"] for message in messages]

    async def edit(self, post: Post, chat_id: int, message_ids: list[int]) -> None:
        """Меняет текст и кнопки уже отправленного поста."""
        if not message_ids:
            return

        options = TelegramOptions.model_validate(post.telegram)
        payload = {"chat_id": chat_id, "message_id": message_ids[0], "parse_mode": "HTML"}

        if options.buttons and len(post.media) <= 1:
            payload["reply_markup"] = keyboard(post.id, options.buttons)

        if post.media:
            payload["caption"] = to_telegram_html(post.html)
            payload["show_caption_above_media"] = options.caption_above
            method = "editMessageCaption"
        else:
            payload["text"] = to_telegram_html(post.html)
            payload["link_preview_options"] = link_preview_options(options)
            method = "editMessageText"

        with suppress(TelegramError):
            await self.telegram.call(method, payload)

    async def delete(self, chat_id: int, message_ids: list[int]) -> None:
        """Удаляет сообщения поста из чата. Если удалить нельзя — просто пропускает."""
        with suppress(TelegramError):
            await self.telegram.call("deleteMessages", {"chat_id": chat_id, "message_ids": message_ids})


def link_preview_options(options: TelegramOptions) -> dict[str, bool]:
    """Превью ссылки: как решит Telegram, выключено, маленькое или большое."""
    if options.link_preview == LinkPreview.OFF:
        return {"is_disabled": True}

    return {
        "prefer_small_media": options.link_preview == LinkPreview.SMALL,
        "prefer_large_media": options.link_preview == LinkPreview.LARGE,
        "show_above_text": options.link_preview_above,
    }


def keyboard(post_id: int, buttons: list[list[TelegramButton]]) -> dict[str, Any]:
    """Собирает кнопки под постом по рядам."""
    rows = []

    for row_number, row in enumerate(buttons):
        rows.append([inline_button(post_id, row_number, number, button) for number, button in enumerate(row)])

    return {"inline_keyboard": rows}


def inline_button(post_id: int, row_number: int, number: int, button: TelegramButton) -> dict[str, Any]:
    """Собирает одну кнопку: ссылку, копирование текста или скрытый текст."""
    telegram_button: dict[str, Any] = {"text": button.text}

    if button.style is not None:
        telegram_button["style"] = button.style

    if button.kind == ButtonKind.URL:
        telegram_button["url"] = button.value
    elif button.kind == ButtonKind.COPY:
        telegram_button["copy_text"] = {"text": button.value}
    else:
        telegram_button["callback_data"] = f"hidden:{post_id}:{row_number}:{number}"

    return telegram_button
