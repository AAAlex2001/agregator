"""Требования к статьям из content/articles: структура, объём, ссылки, форматы."""

from typing import Any

import pytest

from services.article_import.rules import check_article

SLUG = "tender-na-ekspertizu-promyshlennoy-bezopasnosti"
PARAGRAPH = "<p>" + " ".join(["Экспертиза промышленной безопасности нужна владельцу объекта"] * 24) + "</p>"
TABLE = (
    "<table><thead><tr><th>Критерий</th><th>ЭТП</th><th>Площадка</th></tr></thead>"
    "<tbody><tr><td>Плата</td><td>Есть</td><td>Нет</td></tr>"
    "<tr><td>Отбор</td><td>Цена</td><td>Цена и срок</td></tr>"
    "<tr><td>Контакт</td><td>Через площадку</td><td>Напрямую</td></tr></tbody></table>"
)
LIST = "<ul><li><strong>Первое.</strong> пояснение</li><li><strong>Второе.</strong> пояснение</li></ul>"
STEPS = "<ol>" + "".join(f"<li>Шаг {n}</li>" for n in range(1, 7)) + "</ol>"
LAW_URL = "https://www.consultant.ru/document/cons_doc_LAW_15234/"
LAW = f"<a href='{LAW_URL}' target='_blank' rel='noopener noreferrer'>116-ФЗ</a>"
CATALOG = {LAW_URL: "Федеральный закон от 21.07.1997 № 116-ФЗ"}
CTA = "<p>Разместите заявку на <a href='/ekspertiza-promyshlennoy-bezopasnosti'>Ресурс-Плюс</a>.</p>"


def section(title: str, body: str = PARAGRAPH) -> str:
    return f"<h2>{title}</h2>{body}"


def build_body(headings: list[str], extra: str = "") -> str:
    sections = "".join(section(title) for title in headings)
    return f"{PARAGRAPH}<p>Вступление со ссылкой на {LAW}.</p>{sections}{TABLE}{LIST}{LIST}{extra}{CTA}"


def make_article(**overrides: Any) -> dict[str, Any]:
    article: dict[str, Any] = {
        "slug": SLUG,
        "legacy_id": -5,
        "direction": "EXPERTISE",
        "format": "guide",
        "title": "Тендер на экспертизу промышленной безопасности: как выбрать исполнителя",
        "excerpt": "Как заказчику составить задание на экспертизу, сравнить предложения и не получить формальное заключение по минимальной цене.",
        "tags": ["Экспертиза промышленной безопасности", "Тендерные площадки"],
        "meta_title": "Тендер на ЭПБ: как выбрать исполнителя",
        "meta_description": "Как провести закупку экспертизы промышленной безопасности: задание, критерии отбора, проверка аттестации экспертов и типичные ошибки.",
        "meta_keywords": "тендер на ЭПБ, закупка экспертизы промышленной безопасности, выбор экспертной организации, аттестация экспертов, техническое задание ЭПБ",
        "published_at": "2026-06-19T09:00:00Z",
        "content_html": build_body(
            ["Раздел один", "Раздел два", "Раздел три", "Раздел четыре", "Раздел пять"]
        ),
    }
    article.update(overrides)
    return article


def test_well_formed_article_passes() -> None:
    assert check_article(make_article(), SLUG, CATALOG) == []


def test_missing_fields_stop_other_checks() -> None:
    problems = check_article(make_article(title="", content_html=""), SLUG, CATALOG)

    assert problems == ["пустое поле title", "пустое поле content_html"]


@pytest.mark.parametrize(
    ("override", "expected"),
    [
        ({"slug": "other"}, "slug не совпадает"),
        ({"direction": "SPACE"}, "неизвестное направление"),
        ({"format": "essay"}, "неизвестный format"),
        ({"legacy_id": 7}, "legacy_id"),
        ({"tags": []}, "tags"),
        ({"published_at": "вчера"}, "published_at"),
        ({"meta_title": "Коротко"}, "meta_title"),
        ({"meta_keywords": "одна, две"}, "meta_keywords"),
    ],
)
def test_field_problems(override: dict[str, Any], expected: str) -> None:
    problems = check_article(make_article(**override), SLUG, CATALOG)

    assert any(expected in problem for problem in problems), problems


def test_body_without_table_and_lists_is_rejected() -> None:
    body = PARAGRAPH + "".join(section(f"Раздел {n}") for n in range(5)) + f"<p>{LAW}</p>" + CTA
    problems = check_article(make_article(content_html=body), SLUG, CATALOG)

    assert any("нет таблицы" in problem for problem in problems)
    assert any("два списка" in problem for problem in problems)


def test_forbidden_tags_attributes_and_links() -> None:
    body = build_body(
        ["А", "Б", "В", "Г", "Д"],
        extra="<img src='x.png'><p class='lead'>Текст</p><a href='https://example.com/'>чужая</a>",
    )
    problems = check_article(make_article(content_html=body), SLUG, CATALOG)

    assert any("запрещённые теги: img" in problem for problem in problems)
    assert any("запрещённые атрибуты" in problem for problem in problems)
    assert any("не из каталога" in problem and "https://example.com/" in problem for problem in problems)


def test_direction_requires_landing_link_and_brand() -> None:
    body = build_body(["А", "Б", "В", "Г", "Д"]).replace(
        CTA, "<p>Оставьте заявку на <a href='/'>главной</a>.</p>"
    )
    problems = check_article(make_article(content_html=body), SLUG, CATALOG)

    assert any("/ekspertiza-promyshlennoy-bezopasnosti" in problem for problem in problems)
    assert any("Ресурс-Плюс" in problem for problem in problems)


def test_word_count_and_heading_limits() -> None:
    short = (
        f"{PARAGRAPH}"
        + "".join(section(f"Раздел {n}", "<p>кратко</p>") for n in range(5))
        + TABLE
        + LIST
        + LIST
        + f"<p>{LAW}</p>"
        + CTA
    )
    problems = check_article(make_article(content_html=short), SLUG, CATALOG)

    assert any("объём" in problem for problem in problems)
    assert not any("разделов H2" in problem for problem in problems)


def test_faq_needs_question_headings() -> None:
    article = make_article(format="faq")
    assert any("faq" in problem for problem in check_article(article, SLUG, CATALOG))

    questions = ["Нужна ли ЭПБ?", "Кто проводит?", "Сколько стоит?", "Какие сроки?", "Что в итоге?"]
    assert check_article(make_article(format="faq", content_html=build_body(questions)), SLUG) == []


def test_howto_needs_numbered_steps_and_compare_needs_wide_table() -> None:
    headings = ["А", "Б", "В", "Г", "Д"]
    assert any("howto" in p for p in check_article(make_article(format="howto"), SLUG, CATALOG))
    assert (
        check_article(make_article(format="howto", content_html=build_body(headings, extra=STEPS)), SLUG)
        == []
    )

    narrow = (
        TABLE.replace("<th>Площадка</th>", "")
        .replace("<td>Нет</td>", "")
        .replace("<td>Цена и срок</td>", "")
        .replace("<td>Напрямую</td>", "")
    )
    body = build_body(headings).replace(TABLE, narrow)
    assert any(
        "compare" in p
        for p in check_article(make_article(format="compare", content_html=body), SLUG, CATALOG)
    )
