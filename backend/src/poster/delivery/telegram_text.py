import re
from html import unescape

TEXT_LIMIT = 4096
CAPTION_LIMIT = 1024

SITE_TO_TELEGRAM = [
    (r"<li><p>(.*?)</p></li>", r"<li>\1</li>"),
    (r"<h[23]>(.*?)</h[23]>", r"<b>\1</b>\n\n"),
    (r"<p>(.*?)</p>", r"\1\n\n"),
    (r"<li>(.*?)</li>", r"• \1\n"),
    (r"<(ul|ol)>", ""),
    (r"</(ul|ol)>", "\n"),
    (r"<br\s*/?>", "\n"),
    (r"<strong>", "<b>"),
    (r"</strong>", "</b>"),
    (r"<em>", "<i>"),
    (r"</em>", "</i>"),
    (r"\s+</blockquote>", "</blockquote>"),
    (r"\n{3,}", "\n\n"),
]


def to_telegram_html(html: str) -> str:
    """Переводит текст из редактора сайта в разметку Telegram."""
    telegram_html = html

    for pattern, replacement in SITE_TO_TELEGRAM:
        telegram_html = re.sub(pattern, replacement, telegram_html, flags=re.DOTALL)

    return telegram_html.strip()


def telegram_length(telegram_html: str) -> int:
    """Считает длину текста так, как Telegram: эмодзи — за два символа."""
    visible_text = unescape(re.sub(r"<[^>]+>", "", telegram_html))

    return len(visible_text.encode("utf-16-le")) // 2


def length_limit(media_count: int) -> int:
    """У поста без фото лимит 4096 символов, а подпись к фото или видео — до 1024."""
    if media_count > 0:
        return CAPTION_LIMIT

    return TEXT_LIMIT
