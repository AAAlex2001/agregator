"Клиент Yandex.Metrika Reporting API. Тянет агрегаты для дашборда."

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Any

import httpx

from admin.config import admin_config

API_BASE = "https://api-metrika.yandex.net/stat/v1/data"
TIMEOUT_SECONDS = 10.0


@dataclass(slots=True, frozen=True)
class MetrikaSummary:
    "Сводка из Я.Метрики за период: визиты, посетители, просмотры, отказы (%)."

    visits: int
    users: int
    pageviews: int
    bounce_rate: float


@dataclass(slots=True, frozen=True)
class MetrikaTrafficSource:
    "Источник трафика: канал и доля визитов."

    source: str
    visits: int


@dataclass(slots=True, frozen=True)
class MetrikaDailyPoint:
    "Точка временного ряда из Я.Метрики (визиты за день)."

    day: date
    visits: int


@dataclass(slots=True, frozen=True)
class MetrikaDashboard:
    "Агрегаты Я.Метрики для дашборда: 3 окна + источники + ряд за месяц."

    enabled: bool
    error: str | None
    day: MetrikaSummary | None
    week: MetrikaSummary | None
    month: MetrikaSummary | None
    traffic_sources: list[MetrikaTrafficSource]
    daily: list[MetrikaDailyPoint]


class YandexMetrikaClient:
    "HTTP-обёртка над Reporting API. Возвращает доменные dataclass'ы, не сырой JSON."

    def __init__(self, counter_id: int, oauth_token: str | None) -> None:
        self.counter_id = counter_id
        self.oauth_token = oauth_token

    @property
    def enabled(self) -> bool:
        "Метрика подключена когда задан OAuth-токен в ENV."
        return bool(self.oauth_token)

    async def summary(self, days: int) -> MetrikaSummary:
        "Суммарные показатели за последние N дней."
        data = await self.fetch(
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

    async def traffic_sources(self, days: int = 30, limit: int = 8) -> list[MetrikaTrafficSource]:
        "Топ источников трафика за период (по убыванию визитов)."
        data = await self.fetch(
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

    async def daily(self, days: int = 30) -> list[MetrikaDailyPoint]:
        "Визиты по дням за последние N дней."
        data = await self.fetch(
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

    async def fetch(
        self,
        metrics: str,
        since: date,
        until: date,
        dimensions: str | None = None,
        limit: int = 10,
        sort: str | None = None,
    ) -> dict[str, Any]:
        "Низкоуровневый вызов Reporting API. Передаёт OAuth-токен в заголовке, кидает httpx.HTTPError при сетевых проблемах."
        if not self.oauth_token:
            raise RuntimeError("Yandex.Metrika OAuth token не задан")
        params: dict[str, str | int] = {
            "ids": self.counter_id,
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
        headers = {"Authorization": f"OAuth {self.oauth_token}"}
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            r = await client.get(API_BASE, params=params, headers=headers)
            r.raise_for_status()
            return r.json()


async def collect_metrika_dashboard() -> MetrikaDashboard:
    "Собирает все нужные срезы Я.Метрики. При отсутствии токена/ошибке — возвращает пустой результат с пояснением."
    client = YandexMetrikaClient(
        counter_id=admin_config.yandex_metrika_counter_id,
        oauth_token=admin_config.yandex_metrika_oauth_token,
    )
    if not client.enabled:
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
            day=await client.summary(1),
            week=await client.summary(7),
            month=await client.summary(30),
            traffic_sources=await client.traffic_sources(30),
            daily=await client.daily(30),
        )
    except httpx.HTTPError as exc:
        return MetrikaDashboard(
            enabled=True,
            error=f"Ошибка Я.Метрики: {exc}",
            day=None, week=None, month=None,
            traffic_sources=[], daily=[],
        )
