"Главный экран админки: сводка по БД и Яндекс.Метрике, серверный рендер графиков через Chart.js."

import json
from typing import Any

from sqladmin import BaseView, expose
from starlette.requests import Request

from db import SessionLocal


class DashboardView(BaseView):
    "Главная страница админки: счётчики, графики активности (регистрации/заказы/отклики) и срез Я.Метрики."

    name = "Дашборд"
    icon = "fa-solid fa-chart-line"

    @expose("/dashboard", methods=["GET"])
    async def dashboard_view(self, request: Request) -> Any:
        "Эндпоинт GET /admin/dashboard. Собирает метрики из БД и Я.Метрики, отдаёт страницу с Chart.js."
        from metrics import collect_dashboard as collect_db_metrics
        from yandex_metrika import COUNTER_ID
        from yandex_metrika import collect_dashboard as collect_metrika_dashboard

        with SessionLocal() as db:
            db_metrics = collect_db_metrics(db)
        ya = collect_metrika_dashboard()

        chart_data = {
            "users_timeseries": [{"label": p.bucket.isoformat(), "value": p.count} for p in db_metrics.users_timeseries],
            "orders_timeseries": [{"label": p.bucket.isoformat(), "value": p.count} for p in db_metrics.orders_timeseries],
            "responses_timeseries": [{"label": p.bucket.isoformat(), "value": p.count} for p in db_metrics.responses_timeseries],
            "users_by_role": [{"label": r.role, "value": r.count} for r in db_metrics.users_by_role],
            "orders_by_status": [{"label": r.status, "value": r.count} for r in db_metrics.orders_by_status],
            "responses_by_status": [{"label": r.status, "value": r.count} for r in db_metrics.responses_by_status],
            "metrika_daily": [{"label": p.day.isoformat(), "value": p.visits} for p in ya.daily],
            "metrika_sources": [{"label": s.source, "value": s.visits} for s in ya.traffic_sources],
        }

        return await self.templates.TemplateResponse(
            request,
            "dashboard.html",
            {
                "db": db_metrics,
                "ya": ya,
                "counter_id": COUNTER_ID,
                "chart_data": json.dumps(chart_data, ensure_ascii=False),
            },
        )
