"Роуты единой страницы рассылки: загрузка базы, загрузка презентации, превью письма, отправка пачки."

from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import HTMLResponse, RedirectResponse

from integrations.backend_client import import_companies, internal_get_html, send_batch
from integrations.campaign_storage import (
    presentation_public_url,
    save_companies_json,
    save_presentation,
)

MAILING_URL = "/admin/mailing"


def back(params: dict[str, str]) -> RedirectResponse:
    "Редирект на страницу рассылки с сообщением/ошибкой в query."
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(f"{MAILING_URL}?{query}", status_code=303)


def parse_optional_int(value: object) -> int | None:
    "Необязательное целое из поля формы: пусто/мусор → None, иначе >= 1."
    text = str(value or "").strip()
    if not text:
        return None
    try:
        return max(1, int(text))
    except ValueError:
        return None


def setup(app: FastAPI) -> None:
    "Регистрирует роуты раздела рассылки в переданном приложении FastAPI."

    @app.post("/admin-actions/mailing/import-base", name="mailing_import_base")
    async def import_base(request: Request) -> RedirectResponse:
        "Загрузка JSON-базы → сохраняем в общий том → backend импортирует в фоне."
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)
        form = await request.form()
        upload = form.get("companies_file")
        if upload is None or not hasattr(upload, "read"):
            return back({"error": "Прикрепите JSON-файл базы"})
        save_companies_json(await upload.read())
        try:
            import_companies()
        except Exception as exc:
            return back({"error": f"Ошибка: {exc}"})
        return back({
            "message": "База загружается в фоне. Обновите страницу через минуту — счётчик вырастет."
        })

    @app.post("/admin-actions/mailing/upload-presentation", name="mailing_upload_presentation")
    async def upload_presentation(request: Request) -> RedirectResponse:
        "Загрузка PDF-презентации → хостим в общем томе → письмо даёт на неё ссылку (без вложения, без лимита размера)."
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)
        form = await request.form()
        upload = form.get("presentation_file")
        if upload is None or not hasattr(upload, "read"):
            return back({"error": "Прикрепите PDF-файл презентации"})
        pdf_bytes = await upload.read()
        if not pdf_bytes:
            return back({"error": "Пустой файл презентации"})
        save_presentation(pdf_bytes)
        return back({"message": "Презентация загружена — теперь она доступна по ссылке в письме."})

    @app.get("/admin-actions/mailing/preview", name="mailing_preview")
    async def preview(request: Request) -> HTMLResponse:
        "Превью письма в iframe: тема/текст — из формы, ссылка на презентацию — из размещённого файла."
        if not request.session.get("authenticated", False):
            return HTMLResponse("Требуется авторизация", status_code=401)
        params = {
            "subject": request.query_params.get("subject", "Тема письма"),
            "body_text": request.query_params.get("body_text", "Текст письма"),
        }
        url = presentation_public_url()
        if url:
            params["presentation_url"] = url
        try:
            html = internal_get_html("/mailing-preview", params)
        except Exception as exc:
            return HTMLResponse(f"Не удалось получить превью: {exc}", status_code=502)
        return HTMLResponse(html)

    @app.post("/admin-actions/mailing/send", name="mailing_send")
    async def send(request: Request) -> RedirectResponse:
        "Рассылка: тема + текст. Либо следующая пачка непосланных, либо диапазон позиций базы (от-до)."
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)

        form = await request.form()
        subject = str(form.get("subject", "")).strip()
        body_text = str(form.get("body_text", "")).strip()
        batch_size_raw = str(form.get("batch_size", "100")).strip()
        range_from = parse_optional_int(form.get("range_from"))
        range_to = parse_optional_int(form.get("range_to"))

        if not subject or not body_text:
            return back({"error": "Заполните тему и текст письма"})

        if (range_from is None) != (range_to is None):
            return back({"error": "Для диапазона укажите оба поля: «от» и «до»"})
        if range_from is not None and range_to is not None and range_to < range_from:
            return back({"error": "В диапазоне «до» должно быть не меньше «от»"})

        try:
            batch_size = max(1, min(10000, int(batch_size_raw)))
        except ValueError:
            batch_size = 100

        try:
            send_batch(subject, body_text, batch_size, presentation_public_url(), range_from, range_to)
        except Exception as exc:
            return back({"error": f"Ошибка: {exc}"})

        if range_from is not None and range_to is not None:
            msg = (
                f"Отправляется диапазон позиций {range_from}–{range_to} "
                f"(~{range_to - range_from + 1} писем). Проверьте контрольные адреса."
            )
        else:
            msg = f"Пачка ({batch_size}) отправляется. Проверьте контрольные адреса; жмите ещё раз для следующей."
        return back({"message": msg})
