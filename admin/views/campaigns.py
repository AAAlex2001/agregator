"Админ-вьюшки email-кампаний: список/получатели/стоп-лист + кастомная страница запуска рассылки."

from typing import Any

from sqladmin import BaseView, ModelView, expose
from starlette.requests import Request
from starlette.responses import HTMLResponse, RedirectResponse

from integrations.backend_client import create_campaign, send_campaign_batch
from integrations.campaign_storage import new_token, save_import_files
from models import CampaignRecipient, EmailCampaign, EmailSuppression


class EmailCampaignAdmin(ModelView, model=EmailCampaign):
    "Email-кампании: просмотр статуса и счётчиков. Создание и запуск — на странице «Рассылка»."

    name = "Кампания"
    name_plural = "Рассылки · Кампании"
    icon = "fa-solid fa-paper-plane"
    category = "Рассылки"

    can_create = False
    can_edit = False
    can_delete = True

    column_list = [
        EmailCampaign.id,
        EmailCampaign.name,
        EmailCampaign.subject,
        EmailCampaign.status,
        EmailCampaign.batch_size,
        EmailCampaign.created_at,
        EmailCampaign.started_at,
        EmailCampaign.finished_at,
    ]
    column_default_sort = (EmailCampaign.id, True)
    column_labels = {
        EmailCampaign.id: "ID",
        EmailCampaign.name: "Название",
        EmailCampaign.subject: "Тема письма",
        EmailCampaign.status: "Статус",
        EmailCampaign.batch_size: "Размер пачки",
        EmailCampaign.created_at: "Создана",
        EmailCampaign.started_at: "Старт",
        EmailCampaign.finished_at: "Завершена",
    }
    column_formatters = {EmailCampaign.status: lambda m, a: str(m.status)}
    column_formatters_detail = {EmailCampaign.status: lambda m, a: str(m.status)}


class CampaignRecipientAdmin(ModelView, model=CampaignRecipient):
    "Получатели кампаний: компания, email, статус доставки."

    name = "Получатель"
    name_plural = "Рассылки · Получатели"
    icon = "fa-solid fa-address-book"
    category = "Рассылки"

    can_create = False
    can_edit = False
    can_delete = False

    column_list = [
        CampaignRecipient.id,
        CampaignRecipient.campaign_id,
        CampaignRecipient.company_name,
        CampaignRecipient.email,
        CampaignRecipient.status,
        CampaignRecipient.sent_at,
    ]
    column_searchable_list = [CampaignRecipient.email, CampaignRecipient.company_name, CampaignRecipient.inn]
    column_default_sort = (CampaignRecipient.id, True)
    page_size = 100
    column_labels = {
        CampaignRecipient.id: "ID",
        CampaignRecipient.campaign_id: "Кампания",
        CampaignRecipient.company_name: "Компания",
        CampaignRecipient.email: "Email",
        CampaignRecipient.status: "Статус",
        CampaignRecipient.sent_at: "Отправлено",
    }
    column_formatters = {CampaignRecipient.status: lambda m, a: str(m.status)}
    column_formatters_detail = {CampaignRecipient.status: lambda m, a: str(m.status)}


class EmailSuppressionAdmin(ModelView, model=EmailSuppression):
    "Стоп-лист: адреса, которым рассылки больше не уходят (отписки, баунсы, жалобы)."

    name = "Стоп-лист"
    name_plural = "Рассылки · Стоп-лист"
    icon = "fa-solid fa-ban"
    category = "Рассылки"

    can_create = True
    can_edit = False
    can_delete = True

    column_list = [EmailSuppression.id, EmailSuppression.email, EmailSuppression.reason, EmailSuppression.created_at]
    column_searchable_list = [EmailSuppression.email]
    column_default_sort = (EmailSuppression.id, True)
    column_labels = {
        EmailSuppression.id: "ID",
        EmailSuppression.email: "Email",
        EmailSuppression.reason: "Причина",
        EmailSuppression.created_at: "Добавлен",
    }
    column_formatters = {EmailSuppression.reason: lambda m, a: str(m.reason)}


class CampaignLauncherView(BaseView):
    "Страница запуска рассылки: загрузка JSON-базы, создание кампании, старт/пауза."

    name = "Запустить рассылку"
    icon = "fa-solid fa-rocket"
    category = "Рассылки"

    @expose("/campaign-launcher", methods=["GET"])
    async def launcher(self, request: Request) -> Any:
        "Форма создания кампании + результат предыдущего действия (передаётся через query-параметры)."
        return await self.templates.TemplateResponse(
            request,
            "campaign_launcher.html",
            {
                "message": request.query_params.get("message"),
                "error": request.query_params.get("error"),
            },
        )

    @expose("/campaign-launcher/preview", methods=["GET"])
    async def preview(self, request: Request) -> Any:
        "Проксирует превью письма из backend (рендер шаблона) — показывается в iframe на странице запуска."
        from integrations.backend_client import internal_get_html

        subject = request.query_params.get("subject", "Тема письма")
        has_pdf = request.query_params.get("has_pdf", "1") == "1"
        html = internal_get_html("/campaign-preview", {"subject": subject, "has_presentation": has_pdf})
        return HTMLResponse(html)

    @expose("/campaign-launcher/create", methods=["POST"])
    async def create(self, request: Request) -> Any:
        "Принимает форму: сохраняет JSON-базу и PDF в общий том, создаёт кампанию через backend (импорт идёт в фоне)."
        form = await request.form()
        name = str(form.get("name", "")).strip()
        subject = str(form.get("subject", "")).strip()
        batch_size_raw = str(form.get("batch_size", "100")).strip()
        only_active = form.get("only_active") == "on"
        json_upload = form.get("companies_file")
        pdf_upload = form.get("presentation_file")

        if not name or not subject:
            return RedirectResponse(
                request.url_for("admin:campaign-launcher").include_query_params(error="Заполните название и тему"),
                status_code=303,
            )
        if json_upload is None or not hasattr(json_upload, "read"):
            return RedirectResponse(
                request.url_for("admin:campaign-launcher").include_query_params(error="Прикрепите JSON-файл базы"),
                status_code=303,
            )

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
            return RedirectResponse(
                request.url_for("admin:campaign-launcher").include_query_params(error=f"Ошибка: {exc}"),
                status_code=303,
            )

        msg = (
            f"Кампания #{result['campaign_id']} создана, получатели импортируются в фоне "
            f"(следите за счётчиком в разделе «Рассылки · Кампании»). "
            f"Когда импорт завершится — запустите рассылку кнопкой ниже."
        )
        return RedirectResponse(
            request.url_for("admin:campaign-launcher").include_query_params(message=msg),
            status_code=303,
        )

    @expose("/campaign-launcher/send-batch/{campaign_id:int}", methods=["POST"])
    async def send_batch(self, request: Request) -> Any:
        "Разово отправляет одну пачку кампании по id (без цикла)."
        campaign_id = int(request.path_params["campaign_id"])
        try:
            send_campaign_batch(campaign_id)
            msg = f"Кампания #{campaign_id}: пачка поставлена на отправку. Проверьте контрольные адреса и статусы получателей."
            return RedirectResponse(
                request.url_for("admin:campaign-launcher").include_query_params(message=msg),
                status_code=303,
            )
        except Exception as exc:
            return RedirectResponse(
                request.url_for("admin:campaign-launcher").include_query_params(error=f"Ошибка: {exc}"),
                status_code=303,
            )
