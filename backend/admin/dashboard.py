"Кастомная view-страница SQLAdmin: главная панель с метриками и графиками."

import json
from typing import Any

from sqladmin import BaseView, expose
from starlette.requests import Request
from starlette.responses import HTMLResponse

from admin.metrics import (
    DashboardMetrics,
    MetricsService,
    TimeSeriesPoint,
)
from admin.yandex_metrika import MetrikaDashboard, MetrikaSummary, collect_metrika_dashboard
from database.database import AsyncSessionLocal

EMPTY_SUMMARY = MetrikaSummary(visits=0, users=0, pageviews=0, bounce_rate=0.0)


class DashboardView(BaseView):
    "Главная страница админки: счётчики, графики, Я.Метрика."

    name = "Дашборд"
    icon = "fa-solid fa-chart-line"

    @expose("/dashboard", methods=["GET"])
    async def index(self, request: Request) -> HTMLResponse:
        "Эндпоинт GET /admin/dashboard. Собирает метрики из БД и Я.Метрики, отдаёт HTML-страницу с инлайн-данными для Chart.js."
        async with AsyncSessionLocal() as db:
            db_metrics = await MetricsService(db).collect(timeseries_days=30)
        ya_metrika = await collect_metrika_dashboard()
        html = render_dashboard_html(db_metrics, ya_metrika)
        return HTMLResponse(html)


def render_dashboard_html(db: DashboardMetrics, ya: MetrikaDashboard) -> str:
    "Главный рендер: подставляет в HTML-шаблон счётчики (как обычные числа) и JSON для графиков (Chart.js читает его на клиенте)."
    chart_data = {
        "users_timeseries": series_to_chart_format(db.users_timeseries),
        "orders_timeseries": series_to_chart_format(db.orders_timeseries),
        "responses_timeseries": series_to_chart_format(db.responses_timeseries),
        "users_by_role": [{"label": r.role.value, "value": r.count} for r in db.users_by_role],
        "orders_by_status": [{"label": r.status, "value": r.count} for r in db.orders_by_status],
        "responses_by_status": [{"label": r.status, "value": r.count} for r in db.responses_by_status],
        "metrika_daily": [{"label": p.day.isoformat(), "value": p.visits} for p in ya.daily],
        "metrika_sources": [{"label": s.source, "value": s.visits} for s in ya.traffic_sources],
    }
    payload = json.dumps(chart_data, ensure_ascii=False)
    metrika_block = render_metrika_block(ya)
    return HTML_TEMPLATE.replace("__DATA__", payload).replace("__METRIKA__", metrika_block).replace(
        "__USERS_DAY__", str(db.users.day),
    ).replace("__USERS_WEEK__", str(db.users.week)).replace("__USERS_MONTH__", str(db.users.month)) \
        .replace("__ORDERS_DAY__", str(db.orders.day)) \
        .replace("__ORDERS_WEEK__", str(db.orders.week)) \
        .replace("__ORDERS_MONTH__", str(db.orders.month)) \
        .replace("__RESPONSES_DAY__", str(db.responses.day)) \
        .replace("__RESPONSES_WEEK__", str(db.responses.week)) \
        .replace("__RESPONSES_MONTH__", str(db.responses.month))


def series_to_chart_format(points: list[TimeSeriesPoint]) -> list[dict[str, Any]]:
    "Превращает доменные TimeSeriesPoint в массив {label, value} — формат, который ест Chart.js на клиенте."
    return [{"label": p.bucket.isoformat(), "value": p.count} for p in points]


def render_metrika_block(ya: MetrikaDashboard) -> str:
    "Рендер секции Я.Метрики на дашборде. Три ветки: токен не задан (warning с инструкцией) / ошибка API (warning с текстом) / норм (карточки визитов/посетителей/отказов и графики)."
    if not ya.enabled:
        return f'<div class="warning">Я.Метрика не подключена: {ya.error or ""}. ' \
               f'Задай <code>YANDEX_METRIKA_OAUTH_TOKEN</code> в .env (получить: ' \
               f'<a href="https://oauth.yandex.ru/" target="_blank" rel="noopener">oauth.yandex.ru</a>, ' \
               f'scope <code>metrika.read</code>).</div>'
    if ya.error:
        return f'<div class="warning">{ya.error}</div>'
    day = ya.day or EMPTY_SUMMARY
    week = ya.week or EMPTY_SUMMARY
    month = ya.month or EMPTY_SUMMARY
    return f"""
<div class="cards">
  <div class="card"><div class="card-title">Я.Метрика — визиты</div>
    <div class="row"><span>Сутки</span><b>{day.visits}</b></div>
    <div class="row"><span>Неделя</span><b>{week.visits}</b></div>
    <div class="row"><span>Месяц</span><b>{month.visits}</b></div>
  </div>
  <div class="card"><div class="card-title">Я.Метрика — посетители</div>
    <div class="row"><span>Сутки</span><b>{day.users}</b></div>
    <div class="row"><span>Неделя</span><b>{week.users}</b></div>
    <div class="row"><span>Месяц</span><b>{month.users}</b></div>
  </div>
  <div class="card"><div class="card-title">Я.Метрика — отказы</div>
    <div class="row"><span>Сутки</span><b>{day.bounce_rate:.1f}%</b></div>
    <div class="row"><span>Неделя</span><b>{week.bounce_rate:.1f}%</b></div>
    <div class="row"><span>Месяц</span><b>{month.bounce_rate:.1f}%</b></div>
  </div>
</div>
<div class="grid-2">
  <div class="chart-wrap"><h3>Я.Метрика — визиты по дням</h3><canvas id="ya-daily"></canvas></div>
  <div class="chart-wrap"><h3>Я.Метрика — источники трафика</h3><canvas id="ya-sources"></canvas></div>
</div>
"""


HTML_TEMPLATE = """<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Дашборд — Ресурс-Плюс</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; background: #f5f7fa; margin: 0; padding: 24px; color: #222; }
  h1 { margin: 0 0 16px; font-size: 22px; }
  h3 { margin: 0 0 12px; font-size: 14px; color: #555; }
  .nav { margin-bottom: 24px; }
  .nav a { color: #2962ff; text-decoration: none; margin-right: 16px; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .card { background: #fff; padding: 16px 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .card-title { font-weight: 600; font-size: 13px; color: #666; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
  .row:last-child { border-bottom: none; }
  .row b { font-weight: 600; color: #111; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .chart-wrap { background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  canvas { max-height: 280px; }
  .warning { background: #fff3cd; color: #856404; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #ffeeba; }
  .warning a, .warning code { color: #856404; }
</style>
</head>
<body>
<h1>Дашборд</h1>
<div class="nav">
  <a href="/admin">← В админку</a>
  <a href="https://metrika.yandex.ru/dashboard?id=108708847" target="_blank" rel="noopener">Открыть Я.Метрику</a>
</div>

<div class="cards">
  <div class="card"><div class="card-title">Регистрации</div>
    <div class="row"><span>Сутки</span><b>__USERS_DAY__</b></div>
    <div class="row"><span>Неделя</span><b>__USERS_WEEK__</b></div>
    <div class="row"><span>Месяц</span><b>__USERS_MONTH__</b></div>
  </div>
  <div class="card"><div class="card-title">Заказы</div>
    <div class="row"><span>Сутки</span><b>__ORDERS_DAY__</b></div>
    <div class="row"><span>Неделя</span><b>__ORDERS_WEEK__</b></div>
    <div class="row"><span>Месяц</span><b>__ORDERS_MONTH__</b></div>
  </div>
  <div class="card"><div class="card-title">Отклики</div>
    <div class="row"><span>Сутки</span><b>__RESPONSES_DAY__</b></div>
    <div class="row"><span>Неделя</span><b>__RESPONSES_WEEK__</b></div>
    <div class="row"><span>Месяц</span><b>__RESPONSES_MONTH__</b></div>
  </div>
</div>

<div class="grid-2">
  <div class="chart-wrap"><h3>Регистрации по дням (30 дней)</h3><canvas id="users-ts"></canvas></div>
  <div class="chart-wrap"><h3>Пользователи по ролям</h3><canvas id="users-role"></canvas></div>
  <div class="chart-wrap"><h3>Заказы по дням (30 дней)</h3><canvas id="orders-ts"></canvas></div>
  <div class="chart-wrap"><h3>Заказы по статусу</h3><canvas id="orders-status"></canvas></div>
  <div class="chart-wrap"><h3>Отклики по дням (30 дней)</h3><canvas id="responses-ts"></canvas></div>
  <div class="chart-wrap"><h3>Отклики по статусу</h3><canvas id="responses-status"></canvas></div>
</div>

<h1 style="margin-top:32px;">Источники трафика</h1>
__METRIKA__

<script>
const D = __DATA__;
const PALETTE = ['#2962ff', '#00bfa5', '#ffab00', '#d50000', '#aa00ff', '#00b8d4', '#6d4c41', '#5d4037'];

function lineChart(ctx, points, label, color) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: points.map(p => p.label),
      datasets: [{
        label, data: points.map(p => p.value),
        borderColor: color, backgroundColor: color + '22',
        fill: true, tension: 0.25, pointRadius: 2,
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });
}

function pieChart(ctx, points) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: points.map(p => p.label),
      datasets: [{ data: points.map(p => p.value), backgroundColor: PALETTE.slice(0, points.length) }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  });
}

function barChart(ctx, points, label, color) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: points.map(p => p.label),
      datasets: [{ label, data: points.map(p => p.value), backgroundColor: color }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });
}

lineChart(document.getElementById('users-ts'), D.users_timeseries, 'Регистрации', '#2962ff');
lineChart(document.getElementById('orders-ts'), D.orders_timeseries, 'Заказы', '#00bfa5');
lineChart(document.getElementById('responses-ts'), D.responses_timeseries, 'Отклики', '#ffab00');
pieChart(document.getElementById('users-role'), D.users_by_role);
pieChart(document.getElementById('orders-status'), D.orders_by_status);
pieChart(document.getElementById('responses-status'), D.responses_by_status);

const yaDaily = document.getElementById('ya-daily');
if (yaDaily && D.metrika_daily.length) lineChart(yaDaily, D.metrika_daily, 'Визиты', '#d50000');
const yaSrc = document.getElementById('ya-sources');
if (yaSrc && D.metrika_sources.length) barChart(yaSrc, D.metrika_sources, 'Визиты', '#aa00ff');
</script>
</body>
</html>"""
