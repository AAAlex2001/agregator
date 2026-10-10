"""Требования к статьям из backend/content/articles: поля, HTML, структура, ссылки.

Модуль без зависимостей от БД и конфига: его запускает валидатор до загрузки.
"""

import json
import re
from dataclasses import dataclass, field
from datetime import datetime
from functools import cache
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

LINKS_FILE = Path(__file__).resolve().parents[2] / "content" / "links.json"

DIRECTION_PATHS = {
    "EXPERTISE": "/ekspertiza-promyshlennoy-bezopasnosti",
    "AUDIT_SUPB": "/audit-supb",
    "TECH_DIAG": "/tehnicheskoe-diagnostirovanie",
    "DESIGN": "/proektirovanie",
    "SURVEY": "/inzhenernye-izyskaniya",
    "ECOLOGY": "/ekologiya",
    "RESEARCH": "/nir",
    "CADASTRAL": "/kadastrovye-raboty",
    "FORENSIC": "/sudebnaya-ekspertiza",
}
INTERNAL_PATHS = {"/", "/news", "/blog", "/rtn", "/register", *DIRECTION_PATHS.values()}
FORMATS = {"guide", "faq", "howto", "checklist", "compare", "price", "news"}
ALLOWED_TAGS = {
    "p",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "a",
    "blockquote",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "br",
}
ALLOWED_ATTRIBUTES = {
    "a": {"href", "target", "rel"},
    "th": {"colspan", "rowspan"},
    "td": {"colspan", "rowspan"},
    "ol": {"start"},
}
REQUIRED_FIELDS = (
    "slug",
    "format",
    "title",
    "excerpt",
    "tags",
    "meta_title",
    "meta_description",
    "meta_keywords",
    "published_at",
    "content_html",
)
SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
MIN_WORDS = 900
MAX_WORDS = 1800
MIN_H2 = 5
MAX_H2 = 10
BRAND = "Ресурс-Плюс"


@cache
def link_catalog() -> dict[str, str]:
    "Проверенные внешние ссылки: адрес -> официальное название документа или страницы."
    return json.loads(LINKS_FILE.read_text(encoding="utf-8"))


@dataclass
class Table:
    "Таблица статьи: наличие шапки и тела, число колонок и строк."

    has_head: bool = False
    has_body: bool = False
    columns: int = 0
    rows: int = 0
    current_cells: int = 0


@dataclass
class ParsedHtml:
    "То, что валидатору нужно знать о теле статьи."

    tags: list[str] = field(default_factory=list)
    bad_attributes: list[str] = field(default_factory=list)
    hrefs: list[str] = field(default_factory=list)
    headings: list[str] = field(default_factory=list)
    tables: list[Table] = field(default_factory=list)
    list_sizes: list[tuple[str, int]] = field(default_factory=list)
    text: list[str] = field(default_factory=list)
    first_tag: str | None = None


class ArticleParser(HTMLParser):
    "Однопроходный разбор HTML статьи в ParsedHtml."

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.result = ParsedHtml()
        self.heading: list[str] | None = None
        self.lists: list[list[Any]] = []
        self.table: Table | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.result.tags.append(tag)
        if self.result.first_tag is None:
            self.result.first_tag = tag
        allowed = ALLOWED_ATTRIBUTES.get(tag, set())
        self.result.bad_attributes.extend(f"{tag}[{name}]" for name, _ in attrs if name not in allowed)
        if tag == "a":
            self.result.hrefs.append(dict(attrs).get("href") or "")
        elif tag == "h2":
            self.heading = []
        elif tag in ("ul", "ol"):
            self.lists.append([tag, 0])
        elif tag == "li" and self.lists:
            self.lists[-1][1] += 1
        elif tag == "table":
            self.table = Table()
        elif self.table is not None:
            self.track_table(tag)

    def track_table(self, tag: str) -> None:
        if self.table is None:
            return
        if tag == "thead":
            self.table.has_head = True
        elif tag == "tbody":
            self.table.has_body = True
        elif tag == "tr":
            self.table.rows += 1
            self.table.current_cells = 0
        elif tag in ("td", "th"):
            self.table.current_cells += 1
            self.table.columns = max(self.table.columns, self.table.current_cells)

    def handle_endtag(self, tag: str) -> None:
        if tag == "h2" and self.heading is not None:
            self.result.headings.append("".join(self.heading).strip())
            self.heading = None
        elif tag in ("ul", "ol") and self.lists:
            kind, size = self.lists.pop()
            self.result.list_sizes.append((kind, size))
        elif tag == "table" and self.table is not None:
            self.result.tables.append(self.table)
            self.table = None

    def handle_data(self, data: str) -> None:
        self.result.text.append(data)
        if self.heading is not None:
            self.heading.append(data)


def parse_html(html: str) -> ParsedHtml:
    "Разбирает тело статьи."
    parser = ArticleParser()
    parser.feed(html)
    parser.close()
    return parser.result


def word_count(parsed: ParsedHtml) -> int:
    "Количество слов текста без тегов."
    return len(re.findall(r"\w+", " ".join(parsed.text)))


def is_allowed_href(href: str, catalog: dict[str, str]) -> bool:
    "Страница платформы или адрес из проверенного каталога внешних ссылок."
    if href.startswith("/"):
        return href.split("#")[0].split("?")[0] in INTERNAL_PATHS
    return href in catalog


def length_problem(name: str, value: str, low: int, high: int) -> list[str]:
    "Проблема длины строкового поля или пустой список."
    size = len(value.strip())
    return [] if low <= size <= high else [f"{name}: {size} символов, нужно {low}–{high}"]


def check_fields(article: dict[str, Any], slug: str) -> list[str]:
    "Проверяет поля карточки статьи, кроме тела."
    problems = [f"пустое поле {name}" for name in REQUIRED_FIELDS if not article.get(name)]
    if problems:
        return problems

    if article["slug"] != slug or not SLUG_PATTERN.match(slug):
        problems.append("slug не совпадает с именем файла или содержит недопустимые символы")
    if article.get("direction") is not None and article["direction"] not in DIRECTION_PATHS:
        problems.append(f"неизвестное направление {article['direction']!r}")
    if article["format"] not in FORMATS:
        problems.append(f"неизвестный format {article['format']!r}")
    legacy_id = article.get("legacy_id")
    if legacy_id is not None and (not isinstance(legacy_id, int) or legacy_id >= 0):
        problems.append("legacy_id должен быть отрицательным целым или null")
    tags = article["tags"]
    if (
        not isinstance(tags, list)
        or not 1 <= len(tags) <= 5
        or not all(isinstance(t, str) and t.strip() for t in tags)
    ):
        problems.append("tags: от 1 до 5 непустых строк")
    try:
        datetime.fromisoformat(article["published_at"])
    except (TypeError, ValueError):
        problems.append("published_at не в формате ISO 8601")

    problems += length_problem("title", article["title"], 30, 120)
    problems += length_problem("excerpt", article["excerpt"], 100, 400)
    problems += length_problem("meta_title", article["meta_title"], 20, 80)
    problems += length_problem("meta_description", article["meta_description"], 90, 200)
    keywords = [part for part in article["meta_keywords"].split(",") if part.strip()]
    if not 5 <= len(keywords) <= 10:
        problems.append(f"meta_keywords: {len(keywords)} фраз, нужно 5–10")
    return problems


def check_format(article_format: str, parsed: ParsedHtml) -> list[str]:
    "Требования, специфичные для формата статьи."
    if article_format == "faq":
        questions = [text for text in parsed.headings if text.endswith("?")]
        if len(questions) < 4:
            return [f"faq: вопросов в H2 {len(questions)}, нужно не меньше 4"]
    if article_format == "howto" and not any(kind == "ol" and size >= 5 for kind, size in parsed.list_sizes):
        return ["howto: нет нумерованного списка из 5+ шагов"]
    if article_format == "checklist" and len(parsed.list_sizes) < 3:
        return ["checklist: нужно не меньше 3 списков"]
    if article_format == "compare" and not any(table.columns >= 3 for table in parsed.tables):
        return ["compare: нет таблицы сравнения из 3+ колонок"]
    return []


def check_body(article: dict[str, Any], catalog: dict[str, str]) -> list[str]:
    "Проверяет HTML тела: теги, структуру, объём, ссылки и призыв к действию."
    html = article["content_html"]
    parsed = parse_html(html)
    problems = []

    forbidden = sorted(set(parsed.tags) - ALLOWED_TAGS)
    if forbidden:
        problems.append(f"запрещённые теги: {', '.join(forbidden)}")
    if parsed.bad_attributes:
        problems.append(f"запрещённые атрибуты: {', '.join(sorted(set(parsed.bad_attributes)))}")
    if parsed.first_tag != "p":
        problems.append("статья должна начинаться с вводного абзаца <p>")

    if not MIN_H2 <= len(parsed.headings) <= MAX_H2:
        problems.append(f"разделов H2: {len(parsed.headings)}, нужно {MIN_H2}–{MAX_H2}")
    words = word_count(parsed)
    if not MIN_WORDS <= words <= MAX_WORDS:
        problems.append(f"объём {words} слов, нужно {MIN_WORDS}–{MAX_WORDS}")

    good_tables = [
        t for t in parsed.tables if t.has_head and t.has_body and 2 <= t.columns <= 5 and t.rows >= 4
    ]
    if not good_tables:
        problems.append("нет таблицы с thead и tbody, 2–5 колонок и минимум 3 строками данных")
    if len(parsed.list_sizes) < 2:
        problems.append("нужно минимум два списка ul/ol")
    problems += check_format(article["format"], parsed)

    bad_links = sorted({href for href in parsed.hrefs if not is_allowed_href(href, catalog)})
    if bad_links:
        problems.append(
            f"ссылки не из каталога content/links.json и не страницы платформы: {', '.join(bad_links)}"
        )
    if not any(href.startswith("http") for href in parsed.hrefs):
        problems.append("нет ни одной ссылки на нормативный или официальный источник")
    landing = DIRECTION_PATHS.get(article.get("direction") or "")
    internal = [href for href in parsed.hrefs if href.startswith("/")]
    if landing and landing not in internal:
        problems.append(f"нет ссылки на страницу направления {landing}")
    if not landing and not internal:
        problems.append("нет ссылки на страницу платформы")
    if BRAND not in html:
        problems.append(f"нет призыва к действию с упоминанием «{BRAND}»")
    return problems


def check_article(article: dict[str, Any], slug: str, catalog: dict[str, str] | None = None) -> list[str]:
    "Все проблемы статьи; пустой список — статья готова к загрузке."
    problems = check_fields(article, slug)
    if any(problem.startswith("пустое поле") for problem in problems):
        return problems
    return problems + check_body(article, link_catalog() if catalog is None else catalog)
