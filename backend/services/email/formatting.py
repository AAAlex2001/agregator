"Сервисный модуль: formatting."
import html
from datetime import date

from models.user import User


def format_price(amount_kopecks: int | None) -> str:
    "Копейки -> строка вида '12 500 ₽'."
    if not amount_kopecks or amount_kopecks <= 0:
        return "не указана"
    roubles = amount_kopecks // 100
    formatted = f"{roubles:,}".replace(",", " ")
    if amount_kopecks % 100:
        return f"{formatted},{amount_kopecks % 100:02d} ₽"
    return f"{formatted} ₽"


def format_date(value: date | None) -> str:
    "Дата -> 'ДД.ММ.ГГГГ'."
    return value.strftime("%d.%m.%Y") if value else "не указан"


def escape_html(value: str | None) -> str:
    "Экранирует пользовательский текст для Telegram parse_mode=HTML."
    return html.escape(value or "", quote=False)


def preview(text: str | None, limit: int) -> str:
    "Однострочный обрезанный и экранированный превью пользовательского текста."
    trimmed = (text or "").strip()
    if len(trimmed) > limit:
        trimmed = trimmed[:limit] + "…"
    return escape_html(trimmed)


def greeting_for(user: User | None) -> str:
    "Публичный метод сервисного слоя."
    if user is None:
        return "клиент Ресурс-Плюс"
    if user.first_name:
        return user.first_name
    if user.last_name:
        return user.last_name
    return "клиент Ресурс-Плюс"


def full_name(user: User | None) -> str:
    "Публичный метод сервисного слоя."
    if user is None:
        return ""
    parts = [part for part in (user.last_name, user.first_name) if part]
    return " ".join(parts)


def contact_line(user: User | None) -> str:
    "Публичный метод сервисного слоя."
    if user is None:
        return ""
    parts = [part for part in (user.email, user.phone) if part]
    return ", ".join(parts)
