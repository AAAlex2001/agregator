"Админ-вьюшки email-кампаний: список/получатели/стоп-лист + страница запуска рассылки (GET-лендинг)."

from typing import Any

from sqladmin import BaseView, ModelView, expose
from starlette.requests import Request

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
    "Страница запуска рассылки (GET-лендинг). Действия (создать/превью/отправить) — отдельные роуты в actions/campaigns.py."

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
