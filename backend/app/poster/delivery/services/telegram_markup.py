"""Текст из редактора сайта в разметку Telegram.

Абзацы и заголовки становятся строками, заголовки — жирными, списки — строками с • и номерами.
Длина считается как в Telegram: видимый текст в единицах UTF-16.
"""

from html import escape, unescape
from html.parser import HTMLParser

import nh3

TEXT_LIMIT = 4096
CAPTION_LIMIT = 1024

OPENING = {
    "strong": "<b>",
    "em": "<i>",
    "u": "<u>",
    "h2": "<b>",
    "h3": "<b>",
    "blockquote": "<blockquote>",
    "br": "\n",
}
CLOSING = {
    "strong": "</b>",
    "em": "</i>",
    "u": "</u>",
    "h2": "</b>\n\n",
    "h3": "</b>\n\n",
    "blockquote": "</blockquote>\n\n",
    "a": "</a>",
    "li": "\n",
    "ul": "\n",
    "ol": "\n",
    "p": "\n\n",
}


class TelegramMarkup(HTMLParser):
    """Обходит HTML редактора и собирает текст в разметке Telegram."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.list_numbers: list[int | None] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        """Открывающий тег: выделение, ссылка, начало списка или маркер пункта."""

        if tag == "a":
            href = dict(attrs).get("href") or ""
            self.parts.append(f'<a href="{escape(href)}">')
        elif tag in {"ul", "ol"}:
            self.list_numbers.append(0 if tag == "ol" else None)
        elif tag == "li":
            self.parts.append(self.list_marker())
        else:
            self.parts.append(OPENING.get(tag, ""))

    def handle_endtag(self, tag: str) -> None:
        """Закрывающий тег: конец выделения, строки пункта или блока."""

        if tag in {"ul", "ol"} and self.list_numbers:
            self.list_numbers.pop()

        self.parts.append(CLOSING.get(tag, ""))

    def handle_data(self, data: str) -> None:
        """Текст экранируется для parse_mode=HTML."""

        self.parts.append(escape(data, quote=False))

    def list_marker(self) -> str:
        """• для маркированного списка, 1. 2. 3. — для нумерованного."""

        if not self.list_numbers or self.list_numbers[-1] is None:
            return "• "

        self.list_numbers[-1] += 1

        return f"{self.list_numbers[-1]}. "

    def result(self) -> str:
        """Готовый текст без лишних пустых строк."""

        text = "".join(self.parts)
        while "\n\n\n" in text:
            text = text.replace("\n\n\n", "\n\n")

        return text.replace("\n\n</blockquote>", "</blockquote>").strip()


def to_telegram(html: str) -> str:
    """HTML редактора в разметку Telegram."""

    markup = TelegramMarkup()
    markup.feed(html)
    markup.close()

    return markup.result()


def telegram_length(text: str) -> int:
    """Длина видимого текста в единицах UTF-16 — так её считает Telegram."""

    visible = unescape(nh3.clean(text, tags=set()))

    return len(visible.encode("utf-16-le")) // 2


def length_limit(media_count: int) -> int:
    """С фото или видео текст идёт подписью, а она короче."""

    return CAPTION_LIMIT if media_count else TEXT_LIMIT
