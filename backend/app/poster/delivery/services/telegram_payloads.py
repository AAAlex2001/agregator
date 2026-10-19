"""Части запросов Bot API из настроек поста: кнопки, превью ссылок, опрос."""

from typing import Any

from app.poster.delivery.options import ButtonKind, LinkPreview, TelegramButton, TelegramOptions, TelegramPoll

HIDDEN_PREFIX = "hidden"


def without_empty(payload: dict[str, Any]) -> dict[str, Any]:
    """Запрос без пустых полей: Telegram не любит null."""

    return {key: value for key, value in payload.items() if value is not None}


def hidden_callback(post_id: int, row: int, column: int) -> str:
    """Данные скрытой кнопки: какой пост и какая кнопка."""

    return f"{HIDDEN_PREFIX}:{post_id}:{row}:{column}"


def parse_hidden_callback(data: str) -> tuple[int, int, int] | None:
    """Пост, ряд и номер кнопки из данных скрытой кнопки или None."""

    parts = data.split(":")
    if len(parts) != 4 or parts[0] != HIDDEN_PREFIX or not all(part.isdigit() for part in parts[1:]):
        return None

    return int(parts[1]), int(parts[2]), int(parts[3])


def inline_button(post_id: int, row: int, column: int, button: TelegramButton) -> dict[str, Any]:
    """Кнопка под постом: открывает ссылку, копирует текст или показывает скрытый текст."""

    action: dict[str, Any] = {"url": button.value}
    if button.kind == ButtonKind.COPY:
        action = {"copy_text": {"text": button.value}}
    if button.kind == ButtonKind.HIDDEN:
        action = {"callback_data": hidden_callback(post_id, row, column)}

    return without_empty({"text": button.text, "style": button.style, **action})


def keyboard_row(post_id: int, row: int, buttons: list[TelegramButton]) -> list[dict[str, Any]]:
    """Ряд кнопок под постом."""

    return [inline_button(post_id, row, column, button) for column, button in enumerate(buttons)]


def inline_keyboard(post_id: int, options: TelegramOptions) -> dict[str, Any]:
    """Клавиатура под постом. Пустая убирает кнопки при правке."""

    rows = [keyboard_row(post_id, row, buttons) for row, buttons in enumerate(options.buttons)]

    return {"inline_keyboard": rows}


def link_preview_options(options: TelegramOptions) -> dict[str, Any] | None:
    """Превью ссылки: выключено, маленькое, большое или как решит Telegram."""

    above = options.link_preview_above or None

    if options.link_preview == LinkPreview.OFF:
        return {"is_disabled": True}

    if options.link_preview == LinkPreview.SMALL:
        return without_empty({"prefer_small_media": True, "show_above_text": above})

    if options.link_preview == LinkPreview.LARGE:
        return without_empty({"prefer_large_media": True, "show_above_text": above})

    return without_empty({"show_above_text": above}) or None


def delivery_flags(options: TelegramOptions) -> dict[str, Any]:
    """Без звука и запрет пересылки — для каждого сообщения поста."""

    return without_empty({
        "disable_notification": options.silent or None,
        "protect_content": options.protect or None,
    })


def poll_request(chat_id: int, poll: TelegramPoll, options: TelegramOptions) -> dict[str, Any]:
    """Опрос, который уходит следом за постом."""

    return {
        "chat_id": chat_id,
        "question": poll.question,
        "options": [{"text": option} for option in poll.options],
        "is_anonymous": poll.is_anonymous,
        "allows_multiple_answers": poll.allows_multiple_answers,
        **delivery_flags(options),
    }
