"Клиент Yandex.Metrika Reporting API для дашборда админки. Синхронный — потому что админка sync."

import os
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Any

import httpx

API_BASE = "https://api-metrika.yandex.net/stat/v1/data"
TIMEOUT_SECONDS = 10.0
COUNTER_ID = int(os.getenv("YANDEX_METRIKA_COUNTER_ID", "108708847"))
OAUTH_TOKEN = os.getenv("YANDEX_METRIKA_OAUTH_TOKEN", "").strip()


@dataclass(frozen=True)
class MetrikaSummary:
    "Сводка из Я.Метрики за период: визиты, посетители, просмотры, отказы (%)."
    visits: int
    users: int
    pageviews: int
    bounce_rate: float


@dataclass(frozen=True)
class MetrikaTrafficSource:
    "Источник трафика: канал и число визитов за период."
    source: str
    visits: int


@dataclass(frozen=True)
class MetrikaDailyPoint:
    "Точка временного ряда — визиты за конкретный день."
    day: date
    visits: int


@dataclass(frozen=True)
class MetrikaDashboard:
    "Полный срез Я.Метрики для дашборда. enabled=False когда токен не задан; error содержит сообщение если ходить в API не получилось."
    enabled: bool
    error: str | None
    day: MetrikaSummary | None
    week: MetrikaSummary | None
    month: MetrikaSummary | None
    traffic_sources: list[MetrikaTrafficSource]
    daily: list[MetrikaDailyPoint]


EMPTY_SUMMARY = MetrikaSummary(visits=0, users=0, pageviews=0, bounce_rate=0.0)


def fetch_raw(metrics: str, since: date, until: date, dimensions: str = "", limit: int = 10, sort: str = "") -> dict[str, Any]:
    "Низкоуровневый GET к Reporting API. Бросает httpx.HTTPError или RuntimeError если токена нет."
    if not OAUTH_TOKEN:
        raise RuntimeError("YANDEX_METRIKA_OAUTH_TOKEN не задан в .env")
    params: dict[str, str | int] = {
        "ids": COUNTER_ID,
        "metrics": metrics,
        "date1": since.isoformat(),
        "date2": until.isoformat(),
        "accuracy": "full",
        "limit": limit,
    }
    if dimensions:
        params["dimensions"] = dimensions
    if sort:
        params["sort"] = sort
    headers = {"Authorization": f"OAuth {OAUTH_TOKEN}"}
    with httpx.Client(timeout=TIMEOUT_SECONDS) as client:
        r = client.get(API_BASE, params=params, headers=headers)
        r.raise_for_status()
        return r.json()


def summary_for_period(days: int) -> MetrikaSummary:
    "Суммарные показатели за последние N дней (визиты/посетители/просмотры/% отказов)."
    data = fetch_raw(
        metrics="ym:s:visits,ym:s:users,ym:s:pageviews,ym:s:bounceRate",
        since=date.today() - timedelta(days=days - 1),
        until=date.today(),
    )
    totals = data.get("totals", [[0, 0, 0, 0.0]])[0]
    return MetrikaSummary(
        visits=int(totals[0] or 0),
        users=int(totals[1] or 0),
        pageviews=int(totals[2] or 0),
        bounce_rate=float(totals[3] or 0.0),
    )


def traffic_sources(days: int = 30, limit: int = 8) -> list[MetrikaTrafficSource]:
    "Топ источников трафика за период по убыванию визитов."
    data = fetch_raw(
        metrics="ym:s:visits",
        dimensions="ym:s:trafficSource",
        since=date.today() - timedelta(days=days - 1),
        until=date.today(),
        limit=limit,
        sort="-ym:s:visits",
    )
    result: list[MetrikaTrafficSource] = []
    for row in data.get("data", []):
        name = (row["dimensions"][0] or {}).get("name") or "Прочее"
        visits = int((row["metrics"] or [0])[0] or 0)
        result.append(MetrikaTrafficSource(source=str(name), visits=visits))
    return result


def daily_visits(days: int = 30) -> list[MetrikaDailyPoint]:
    "Визиты по дням за последние N дней."
    data = fetch_raw(
        metrics="ym:s:visits",
        dimensions="ym:s:date",
        since=date.today() - timedelta(days=days - 1),
        until=date.today(),
        limit=days + 1,
        sort="ym:s:date",
    )
    result: list[MetrikaDailyPoint] = []
    for row in data.get("data", []):
        raw_date = (row["dimensions"][0] or {}).get("name") or ""
        try:
            day = date.fromisoformat(raw_date)
        except ValueError:
            continue
        visits = int((row["metrics"] or [0])[0] or 0)
        result.append(MetrikaDailyPoint(day=day, visits=visits))
    return result


def collect_dashboard() -> MetrikaDashboard:
    "Собирает все нужные срезы Я.Метрики одним вызовом. При отсутствии токена/ошибке — пустой результат с пояснением."
    if not OAUTH_TOKEN:
        return MetrikaDashboard(
            enabled=False,
            error="Не задан YANDEX_METRIKA_OAUTH_TOKEN в .env",
            day=None, week=None, month=None,
            traffic_sources=[], daily=[],
        )
    try:
        return MetrikaDashboard(
            enabled=True,
            error=None,
            day=summary_for_period(1),
            week=summary_for_period(7),
            month=summary_for_period(30),
            traffic_sources=traffic_sources(30),
            daily=daily_visits(30),
        )
    except httpx.HTTPError as exc:
        return MetrikaDashboard(
            enabled=True,
            error=f"Ошибка Я.Метрики: {exc}",
            day=None, week=None, month=None,
            traffic_sources=[], daily=[],
        )
