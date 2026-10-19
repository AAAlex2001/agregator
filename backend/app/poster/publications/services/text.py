"""Текст публикации: очистка разметки из редактора и видимый текст без тегов."""

import re
from html import unescape

import nh3

from app.poster.publications.models import MAX_POST_TEXT
from app.poster.publications.services.exceptions import PostTextTooLongError

ALLOWED_TAGS = {"p", "br", "h2", "h3", "strong", "em", "u", "blockquote", "ul", "ol", "li", "a"}
ALLOWED_ATTRIBUTES = {"a": {"href"}}
ALLOWED_SCHEMES = {"http", "https"}
BLOCK_BOUNDARY = re.compile(
    r"</(?:p|div|h[1-6]|li|ul|ol|blockquote|pre|tr|td|th)>|<br\s*/?>",
    re.IGNORECASE,
)


def clean_html(html: str) -> str:
    """HTML только с тегами редактора и ссылками http(s). Скрипты и атрибуты вырезаются."""

    cleaned = nh3.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        url_schemes=ALLOWED_SCHEMES,
    )

    return cleaned.strip()


def plain_text(html: str) -> str:
    """Видимый текст без тегов, сущностей и лишних пробелов. Абзацы и заголовки не склеиваются."""

    spaced = BLOCK_BOUNDARY.sub(" ", html)
    text = unescape(nh3.clean(spaced, tags=set()))

    return " ".join(text.split())


def check_text_length(html: str) -> None:
    """Длина видимого текста: теги и экранирование в лимит не входят."""

    if len(plain_text(html)) > MAX_POST_TEXT:
        raise PostTextTooLongError(f"Текст публикации должен быть не длиннее {MAX_POST_TEXT} символов")
