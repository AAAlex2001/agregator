from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape

TEMPLATES_DIR = Path(__file__).resolve().parents[1] / "templates" / "emails"

# Autoescape включён только для .html: .txt-шаблоны рендерятся как plain-text,
# и экранирование пользовательских данных (комментарии, имена, названия компаний)
# в них привело бы к видимым артефактам вроде &amp; / &#39; в почтовых клиентах.
# Решение задокументировано и проверено: user-input в .txt подставляется как есть.
jinja_env = Environment(
    loader=FileSystemLoader(str(TEMPLATES_DIR)),
    autoescape=select_autoescape(enabled_extensions=("html",), default_for_string=False),
    trim_blocks=True,
    lstrip_blocks=True,
    keep_trailing_newline=False,
)


def format_rubles(sum_amount: int | None) -> str:
    if sum_amount is None:
        return "—"
    roubles = sum_amount // 100
    kopeks = sum_amount % 100
    formatted = f"{roubles:,}".replace(",", " ")
    if kopeks:
        return f"{formatted},{kopeks:02d} ₽"
    return f"{formatted} ₽"


def format_date(value: date | None) -> str:
    if value is None:
        return "—"
    return value.strftime("%d.%m.%Y")


def format_rating(value: float | None) -> str:
    if value is None:
        return "—"
    return f"{value:.1f}"


jinja_env.filters["rubles"] = format_rubles
jinja_env.filters["date_ru"] = format_date
jinja_env.filters["rating"] = format_rating


@dataclass(frozen=True)
class RenderedEmail:
    subject: str
    text: str
    html: str


def render_email(name: str, subject: str, context: dict[str, Any]) -> RenderedEmail:
    "Рендерит пару шаблонов {name}.html + {name}.txt и возвращает готовое письмо."
    html_template = jinja_env.get_template(f"{name}.html")
    text_template = jinja_env.get_template(f"{name}.txt")

    enriched = {"subject": subject, **context}
    html_body = html_template.render(**enriched)
    text_body = text_template.render(**enriched)

    return RenderedEmail(subject=subject, text=text_body, html=html_body)
