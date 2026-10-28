import re
from html import unescape

import nh3

from src.poster.posts.exceptions import PostTextTooLongError
from src.poster.posts.models import MAX_POST_TEXT

ALLOWED_TAGS = {"p", "br", "h2", "h3", "strong", "em", "u", "blockquote", "ul", "ol", "li", "a"}


def clean_html(html: str) -> str:
    """Убирает из текста редактора всё, кроме разрешённых тегов и http(s)-ссылок."""
    return nh3.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes={"a": {"href"}},
        url_schemes={"http", "https"},
        link_rel=None,
    )


def plain_text(html: str) -> str:
    """Возвращает видимый текст без тегов."""
    spaced_html = re.sub(r"</(p|h2|h3|li|blockquote)>|<br\s*/?>", " ", html)
    text = unescape(re.sub(r"<[^>]+>", "", spaced_html))

    return " ".join(text.split())


def check_text_length(html: str) -> None:
    """Проверяет, что видимый текст поста не длиннее 5000 символов."""
    if len(plain_text(html)) > MAX_POST_TEXT:
        raise PostTextTooLongError()
