"POST/GET-роуты email-рассылки: создание кампании, превью письма, разовая отправка пачки."

from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import HTMLResponse, RedirectResponse

from integrations.backend_client import (
    create_campaign,
    internal_get_html,
    send_campaign_batch,
)
from integrations.campaign_storage import new_token, save_import_files

LAUNCHER_URL = "/admin/campaign-launcher"


def back(params: dict[str, str]) -> RedirectResponse:
    "Редирект на страницу запуска рассылки с сообщением/ошибкой в query."
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(f"{LAUNCHER_URL}?{query}", status_code=303)


def setup(app: FastAPI) -> None:
    "Регистрирует роуты раздела рассылок в переданном приложении FastAPI."

    @app.get("/admin-actions/campaigns/preview", name="campaign_preview_admin")
    async def campaign_preview(request: Request) -> HTMLResponse:
        "Превью письма в iframe: проксирует рендер шаблона из backend."
        if not request.session.get("authenticated", False):
            return HTMLResponse("Требуется авторизация", status_code=401)
        subject = request.query_params.get("subject", "Тема письма")
        has_pdf = request.query_params.get("has_pdf", "1") == "1"
        try:
            html = internal_get_html(
                "/campaign-preview", {"subject": subject, "has_presentation": has_pdf}
            )
        except Exception as exc:
            return HTMLResponse(f"Не удалось получить превью: {exc}", status_code=502)
        return HTMLResponse(html)

    @app.post("/admin-actions/campaigns/create", name="campaign_create")
    async def campaign_create(request: Request) -> RedirectResponse:
        "Сохраняет JSON-базу и PDF в общий том, создаёт кампанию через backend (импорт получателей идёт в фоне)."
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)

        form = await request.form()
        name = str(form.get("name", "")).strip()
        subject = str(form.get("subject", "")).strip()
        batch_size_raw = str(form.get("batch_size", "100")).strip()
        only_active = form.get("only_active") == "on"
        json_upload = form.get("companies_file")
        pdf_upload = form.get("presentation_file")

        if not name or not subject:
            return back({"error": "Заполните название и тему"})
        if json_upload is None or not hasattr(json_upload, "read"):
            return back({"error": "Прикрепите JSON-файл базы"})

        try:
            batch_size = max(1, min(5000, int(batch_size_raw)))
        except ValueError:
            batch_size = 100

        token = new_token()
        json_bytes = await json_upload.read()
        pdf_bytes = await pdf_upload.read() if pdf_upload is not None and hasattr(pdf_upload, "read") else None
        has_presentation = save_import_files(token, json_bytes, pdf_bytes)

        try:
            result = create_campaign(name, subject, batch_size, token, has_presentation, only_active)
        except Exception as exc:
            return back({"error": f"Ошибка: {exc}"})

        return back({
            "message": (
                f"Кампания #{result['campaign_id']} создана, получатели импортируются в фоне "
                f"(счётчик растёт в «Рассылки · Кампании»). После импорта — отправьте пачку ниже."
            )
        })

    @app.post("/admin-actions/campaigns/{campaign_id}/send-batch", name="campaign_send_batch")
    async def campaign_send_batch(request: Request, campaign_id: int) -> RedirectResponse:
        "Разово отправляет одну пачку кампании (без цикла)."
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)
        try:
            send_campaign_batch(campaign_id)
        except Exception as exc:
            return back({"error": f"Ошибка: {exc}"})
        return back({
            "message": f"Кампания #{campaign_id}: пачка отправляется. Проверьте контрольные адреса и статусы получателей."
        })
