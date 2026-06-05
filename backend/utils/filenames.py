"""
Санитайз пользовательских имён файлов перед сохранением в БД и отображением в UI.

Сами файлы пишутся под uuid-именами — path traversal невозможен. Но оригинальное
имя возвращается клиенту и попадает в чаты/карточки — убираем то, что может
сломать вёрстку или дать XSS у потребителей без HTML-escape.
"""
import os
import re
import unicodedata

_MAX_LEN = 200
_UNSAFE_CHARS = re.compile(r"[\x00-\x1f\x7f<>\"\\]")


def sanitize_filename(name: str | None, fallback: str = "file") -> str:
    "Возвращает безопасное имя файла: без control-символов, без path-разделителей, ограниченной длины."
    if not name:
        return fallback

    # Берём только базовое имя — на случай если кто-то прислал путь.
    base = os.path.basename(name.replace("\\", "/"))
    base = unicodedata.normalize("NFC", base)
    base = _UNSAFE_CHARS.sub("", base).strip()

    if not base or base in {".", ".."}:
        return fallback

    if len(base) > _MAX_LEN:
        # Сохраняем расширение.
        root, ext = os.path.splitext(base)
        ext = ext[:32]
        root = root[: _MAX_LEN - len(ext)]
        base = root + ext

    return base
