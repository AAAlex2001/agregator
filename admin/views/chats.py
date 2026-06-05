"Админ-вьюшки чатов: чаты по заказам и публичный чат экспертов с модерацией."

from typing import Any

from sqladmin import BaseView, ModelView, expose
from sqlalchemy.orm import selectinload
from starlette.requests import Request

from db import SessionLocal
from models import Chat, ChatMessage, ExpertRoomBan, ExpertRoomMessage


class ChatAdmin(ModelView, model=Chat):
    "Чаты между заказчиком и экспертом по заказу: просмотр истории сообщений."

    name = "Чат"
    name_plural = "Чаты"
    icon = "fa-solid fa-comments"
    details_template = "chat_detail.html"

    column_list = [
        Chat.id, Chat.uuid, Chat.order, Chat.customer,
        Chat.expert, Chat.created_at,
    ]
    column_sortable_list = [Chat.id, Chat.created_at]
    column_default_sort = (Chat.id, True)

    column_details_list = [
        Chat.id, Chat.uuid, Chat.order, Chat.customer, Chat.expert,
        Chat.created_at, Chat.updated_at,
    ]

    form_columns = [Chat.order, Chat.customer, Chat.expert]

    column_labels = {
        Chat.id: "ID",
        Chat.uuid: "UUID",
        Chat.order: "Заказ",
        Chat.customer: "Заказчик",
        Chat.expert: "Эксперт",
        Chat.created_at: "Создан",
        Chat.updated_at: "Обновлён",
    }

    async def get_object_for_details(self, value: Any) -> Any:
        "Подгружает чат с сообщениями и отправителями для шаблона деталей."
        stmt = self._stmt_by_identifier(value)
        for relation in self._details_relations:
            stmt = stmt.options(selectinload(relation))
        stmt = stmt.options(
            selectinload(Chat.messages).selectinload(ChatMessage.sender),
        )
        return await self._get_object_by_pk(stmt)


class ExpertRoomChatView(BaseView):
    "Лента публичного чата экспертов с модерацией (удаление сообщений, баны)."

    name = "Чат экспертов · лента"
    icon = "fa-solid fa-message"
    category = "Чат экспертов"

    @expose("/expert-room-chat", methods=["GET"])
    async def chat_view(self, request: Request) -> Any:
        "Эндпоинт GET /admin/expert-room-chat: отдаёт страницу со всеми сообщениями."
        with SessionLocal() as db:
            messages = (
                db.query(ExpertRoomMessage)
                .options(selectinload(ExpertRoomMessage.sender))
                .order_by(ExpertRoomMessage.created_at.asc())
                .all()
            )
        return await self.templates.TemplateResponse(
            request, "expert_room_chat.html", {"messages": messages}
        )


class ExpertRoomMessageAdmin(ModelView, model=ExpertRoomMessage):
    "Сообщения чата экспертов: только просмотр и удаление, создание/редактирование запрещено."

    name = "Сообщение чата экспертов"
    name_plural = "Чат экспертов: сообщения"
    icon = "fa-solid fa-comments"
    category = "Чат экспертов"

    can_create = False
    can_edit = False
    can_delete = True

    column_list = [
        ExpertRoomMessage.id,
        ExpertRoomMessage.sender,
        ExpertRoomMessage.text,
        ExpertRoomMessage.created_at,
    ]
    column_default_sort = (ExpertRoomMessage.id, True)
    column_sortable_list = [ExpertRoomMessage.id, ExpertRoomMessage.created_at]
    column_searchable_list = [ExpertRoomMessage.text]

    column_details_list = [
        ExpertRoomMessage.id,
        ExpertRoomMessage.sender,
        ExpertRoomMessage.text,
        ExpertRoomMessage.created_at,
    ]

    column_labels = {
        ExpertRoomMessage.id: "ID",
        ExpertRoomMessage.sender: "Автор",
        ExpertRoomMessage.text: "Текст",
        ExpertRoomMessage.created_at: "Отправлено",
    }


class ExpertRoomBanAdmin(ModelView, model=ExpertRoomBan):
    "Баны экспертов в общем чате: запись хранит автора и публичную причину."

    name = "Бан в чате экспертов"
    name_plural = "Чат экспертов: баны"
    icon = "fa-solid fa-ban"
    category = "Чат экспертов"

    can_create = True
    can_edit = True
    can_delete = True

    column_list = [
        ExpertRoomBan.id,
        ExpertRoomBan.user,
        ExpertRoomBan.reason,
        ExpertRoomBan.created_at,
    ]
    column_default_sort = (ExpertRoomBan.id, True)
    column_sortable_list = [ExpertRoomBan.id, ExpertRoomBan.created_at]

    form_columns = [ExpertRoomBan.user, ExpertRoomBan.reason]

    column_details_list = [
        ExpertRoomBan.id,
        ExpertRoomBan.user,
        ExpertRoomBan.reason,
        ExpertRoomBan.created_at,
    ]

    column_labels = {
        ExpertRoomBan.id: "ID",
        ExpertRoomBan.user: "Эксперт",
        ExpertRoomBan.reason: "Причина (видна юзеру)",
        ExpertRoomBan.created_at: "Создан",
    }
