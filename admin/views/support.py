"Админ-вьюшки раздела поддержки: тикеты пользователей и индивидуальные сообщения с вложениями."

from typing import Any

from markupsafe import Markup, escape
from sqladmin import ModelView

from models import SupportTicket, SupportTicketMessage


def format_ticket_attachments(value: Any) -> Any:
    "Форматирует JSON-массив вложений сообщения в список ссылок для column_formatters_detail."
    if not value:
        return "—"
    if isinstance(value, list):
        parts = []
        for item in value:
            if isinstance(item, dict):
                name = escape(item.get("name") or "Файл")
                url = item.get("url") or "#"
                parts.append(
                    f'<div style="margin:4px 0"><a href="{url}" target="_blank">{name}</a></div>'
                )
        return Markup("".join(parts)) if parts else "—"
    return str(value)


class SupportTicketAdmin(ModelView, model=SupportTicket):
    "Тикеты поддержки: просмотр карточки тикета с ответами админа через action-роуты."

    name = "Тикет"
    name_plural = "Поддержка · Тикеты"
    icon = "fa-solid fa-life-ring"
    category = "Поддержка"
    edit_template = "support_ticket_edit.html"

    column_list = [
        SupportTicket.id,
        SupportTicket.number,
        SupportTicket.subject,
        SupportTicket.category,
        SupportTicket.status,
        SupportTicket.has_unread_for_admin,
        SupportTicket.user_id,
        SupportTicket.updated_at,
    ]
    column_searchable_list = [SupportTicket.number, SupportTicket.subject]
    column_sortable_list = [
        SupportTicket.id,
        SupportTicket.status,
        SupportTicket.category,
        SupportTicket.updated_at,
        SupportTicket.created_at,
    ]
    column_default_sort = (SupportTicket.updated_at, True)

    column_details_list = [
        SupportTicket.id,
        SupportTicket.number,
        SupportTicket.user,
        SupportTicket.subject,
        SupportTicket.category,
        SupportTicket.status,
        SupportTicket.has_unread_for_user,
        SupportTicket.has_unread_for_admin,
        SupportTicket.created_at,
        SupportTicket.updated_at,
        SupportTicket.messages,
    ]

    form_columns = [
        SupportTicket.subject,
        SupportTicket.category,
        SupportTicket.status,
        SupportTicket.has_unread_for_user,
        SupportTicket.has_unread_for_admin,
    ]

    column_labels = {
        SupportTicket.id: "ID",
        SupportTicket.number: "Номер",
        SupportTicket.user_id: "ID пользователя",
        SupportTicket.user: "Пользователь",
        SupportTicket.subject: "Тема",
        SupportTicket.category: "Категория",
        SupportTicket.status: "Статус",
        SupportTicket.has_unread_for_user: "Не прочитано пользователем",
        SupportTicket.has_unread_for_admin: "Требует ответа",
        SupportTicket.created_at: "Создан",
        SupportTicket.updated_at: "Обновлён",
        SupportTicket.messages: "Сообщения",
    }

    column_formatters = {
        SupportTicket.category: lambda m, a: str(m.category),
        SupportTicket.status: lambda m, a: str(m.status),
    }
    column_formatters_detail = {
        SupportTicket.category: lambda m, a: str(m.category),
        SupportTicket.status: lambda m, a: str(m.status),
    }


class SupportTicketMessageAdmin(ModelView, model=SupportTicketMessage):
    "Отдельные сообщения тикетов: только просмотр (создание идёт через ответ в тикете)."

    name = "Сообщение"
    name_plural = "Поддержка · Сообщения"
    icon = "fa-solid fa-comment"
    category = "Поддержка"

    can_create = False
    can_edit = False

    column_list = [
        SupportTicketMessage.id,
        SupportTicketMessage.ticket_id,
        SupportTicketMessage.author_kind,
        SupportTicketMessage.author_name,
        SupportTicketMessage.created_at,
    ]
    column_default_sort = (SupportTicketMessage.created_at, True)

    column_details_list = [
        SupportTicketMessage.id,
        SupportTicketMessage.ticket_id,
        SupportTicketMessage.author_kind,
        SupportTicketMessage.author_user_id,
        SupportTicketMessage.author_name,
        SupportTicketMessage.text,
        SupportTicketMessage.attachments,
        SupportTicketMessage.created_at,
    ]

    column_labels = {
        SupportTicketMessage.id: "ID",
        SupportTicketMessage.ticket_id: "ID тикета",
        SupportTicketMessage.author_kind: "Источник",
        SupportTicketMessage.author_user_id: "ID автора",
        SupportTicketMessage.author_name: "Автор",
        SupportTicketMessage.text: "Текст",
        SupportTicketMessage.attachments: "Файлы",
        SupportTicketMessage.created_at: "Создано",
    }

    column_formatters = {
        SupportTicketMessage.author_kind: lambda m, a: str(m.author_kind),
    }
    column_formatters_detail = {
        SupportTicketMessage.author_kind: lambda m, a: str(m.author_kind),
        SupportTicketMessage.attachments: lambda m, a: format_ticket_attachments(m.attachments),
    }
