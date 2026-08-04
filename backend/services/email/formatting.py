"Сервисный модуль: formatting."
import html

from models.account import Account
from models.labor import LaborListingKind


def labor_listing_title(kind: LaborListingKind) -> str:
    "Заголовок labor-объявления для чатов, писем и уведомлений."
    if kind == LaborListingKind.EXPERT_WANTED:
        return "Поиск эксперта в штат"
    return "Готов к трудовому договору"


def format_price(amount_kopecks: int | None) -> str:
    "Копейки -> строка вида '12 500 ₽'."
    if not amount_kopecks or amount_kopecks <= 0:
        return "не указана"
    roubles = amount_kopecks // 100
    formatted = f"{roubles:,}".replace(",", " ")
    if amount_kopecks % 100:
        return f"{formatted},{amount_kopecks % 100:02d} ₽"
    return f"{formatted} ₽"


def escape_html(value: str | None) -> str:
    "Экранирует пользовательский текст для Telegram parse_mode=HTML."
    return html.escape(value or "", quote=False)


def greeting_for(user: Account | None) -> str:
    "Публичный метод сервисного слоя."
    if user is None:
        return "клиент Ресурс-Плюс"
    if user.first_name:
        return user.first_name
    if user.last_name:
        return user.last_name
    return "клиент Ресурс-Плюс"


def full_name(user: Account | None) -> str:
    "Публичный метод сервисного слоя."
    if user is None:
        return ""
    parts = [part for part in (user.last_name, user.first_name) if part]
    return " ".join(parts)


def contact_line(user: Account | None) -> str:
    "Публичный метод сервисного слоя."
    if user is None:
        return ""
    parts = [part for part in (user.email, user.phone) if part]
    return ", ".join(parts)
