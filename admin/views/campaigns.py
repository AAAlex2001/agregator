"Админ-раздел рассылки: просмотр базы компаний + единая страница «Рассылка» (загрузка базы, текст, PDF, отправка)."

import logging
from typing import Any

from sqladmin import BaseView, ModelView, expose
from starlette.requests import Request

from models import Company

logger = logging.getLogger(__name__)

DEFAULT_SUBJECT = 'Письмо и презентация новой площадки-агрегатора "Ресурс-плюс"'
DEFAULT_BODY = (
    "Направляем Вам информационное письмо и презентацию электронной "
    "площадки-агрегатора «Ресурс-Плюс» — сервиса для проведения тендеров "
    "на экспертизу промышленной безопасности опасных производственных объектов.\n"
    "Просим подтвердить получение письма и направить входящий номер в ответном сообщении."
)


class CompanyAdmin(ModelView, model=Company):
    "База компаний (из загруженного JSON). Просмотр, поиск, статус отправки."

    name = "Компания"
    name_plural = "Рассылка · База компаний"
    icon = "fa-solid fa-building"
    category = "Рассылка"

    can_create = False
    can_edit = False
    can_delete = True

    column_list = [Company.id, Company.inn, Company.name, Company.email, Company.region, Company.status, Company.sent_at]
    column_searchable_list = [Company.inn, Company.name, Company.email]
    column_default_sort = (Company.id, True)
    page_size = 100
    column_labels = {
        Company.id: "ID",
        Company.inn: "ИНН",
        Company.name: "Компания",
        Company.email: "Email",
        Company.region: "Регион",
        Company.status: "Статус",
        Company.sent_at: "Отправлено",
    }


class MailingView(BaseView):
    "Единая страница рассылки: превью, загрузка базы, тема/текст письма, PDF, размер пачки, кнопка «Разослать»."

    name = "Рассылка"
    icon = "fa-solid fa-paper-plane"
    category = "Рассылка"

    @expose("/mailing", methods=["GET"])
    async def mailing(self, request: Request) -> Any:
        "Страница рассылки + статистика базы и текущая презентация."
        from integrations.backend_client import companies_stats
        from integrations.campaign_storage import presentation_public_url

        stats: dict[str, Any] = {}
        try:
            stats = companies_stats()
        except Exception:
            logger.exception("Не удалось получить статистику базы компаний")

        return await self.templates.TemplateResponse(
            request,
            "mailing.html",
            {
                "message": request.query_params.get("message"),
                "error": request.query_params.get("error"),
                "stats": stats,
                "presentation_url": presentation_public_url(),
                "default_subject": DEFAULT_SUBJECT,
                "default_body": DEFAULT_BODY,
            },
        )
