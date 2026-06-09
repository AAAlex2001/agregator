"Админ-вьюшки раздела заказов: сами заказы, отклики экспертов и отзывы по сделкам."

from sqladmin import ModelView

from helpers.company import format_technical_files
from models import Order, OrderResponse, Review


class OrderAdmin(ModelView, model=Order):
    "Заказы заказчиков: просмотр карточек, ручная корректировка статусов и сумм."

    name = "Заказ"
    name_plural = "Заказы"
    icon = "fa-solid fa-clipboard-list"

    column_list = [
        Order.id, Order.title, Order.company, Order.status,
        Order.sum_amount, Order.deadline, Order.customer, Order.assigned_expert,
        Order.created_at,
    ]
    column_searchable_list = [Order.title, Order.company]
    column_sortable_list = [Order.id, Order.status, Order.sum_amount, Order.deadline, Order.created_at]
    column_default_sort = (Order.id, True)

    column_details_list = [
        Order.id, Order.title, Order.company,
        Order.comment, Order.customer, Order.assigned_expert,
        Order.technical_files, Order.sum_amount, Order.deadline,
        Order.status, Order.created_at, Order.updated_at,
        Order.badges, Order.responses, Order.chats,
    ]

    form_columns = [
        Order.title, Order.company, Order.comment,
        Order.customer, Order.assigned_expert,
        Order.sum_amount, Order.deadline, Order.status,
    ]

    column_formatters = {
        Order.sum_amount: lambda m, a: f"{m.sum_amount / 100:.2f} ₽" if m.sum_amount is not None else "0.00 ₽",
        Order.status: lambda m, a: str(m.status),
        Order.technical_files: format_technical_files,
    }
    column_formatters_detail = {
        Order.sum_amount: lambda m, a: f"{m.sum_amount / 100:.2f} ₽" if m.sum_amount is not None else "0.00 ₽",
        Order.status: lambda m, a: str(m.status),
        Order.technical_files: format_technical_files,
    }

    column_labels = {
        Order.id: "ID",
        Order.title: "Название",
        Order.company: "Компания",
        Order.comment: "Описание",
        Order.customer: "Заказчик",
        Order.assigned_expert: "Назначенный эксперт",
        Order.technical_files: "Тех. файлы",
        Order.sum_amount: "Сумма",
        Order.deadline: "Дедлайн",
        Order.status: "Статус",
        Order.created_at: "Создан",
        Order.updated_at: "Обновлён",
        Order.badges: "Бейджи",
        Order.responses: "Отклики",
        Order.chats: "Чаты",
    }


class OrderResponseAdmin(ModelView, model=OrderResponse):
    "Отклики экспертов на заказы: суммы, дедлайны, подтверждения, файлы."

    name = "Отклик"
    name_plural = "Отклики"
    icon = "fa-solid fa-reply"

    column_list = [
        OrderResponse.id, OrderResponse.order, OrderResponse.expert,
        OrderResponse.status, OrderResponse.proposed_sum_amount,
        OrderResponse.proposed_deadline, OrderResponse.expert_confirmed,
        OrderResponse.created_at,
    ]
    column_searchable_list = [OrderResponse.comment]
    column_sortable_list = [OrderResponse.id, OrderResponse.status, OrderResponse.proposed_sum_amount, OrderResponse.created_at]
    column_default_sort = (OrderResponse.id, True)

    column_details_list = [
        OrderResponse.id, OrderResponse.order, OrderResponse.expert,
        OrderResponse.comment, OrderResponse.proposed_sum_amount,
        OrderResponse.proposed_deadline, OrderResponse.technical_files,
        OrderResponse.expert_confirmed, OrderResponse.status,
        OrderResponse.created_at, OrderResponse.updated_at,
        OrderResponse.reviews,
    ]

    form_columns = [
        OrderResponse.order, OrderResponse.expert,
        OrderResponse.comment, OrderResponse.proposed_sum_amount,
        OrderResponse.proposed_deadline, OrderResponse.expert_confirmed,
        OrderResponse.status,
    ]

    column_formatters = {
        OrderResponse.proposed_sum_amount: lambda m, a: f"{m.proposed_sum_amount / 100:.2f} ₽" if m.proposed_sum_amount is not None else "0.00 ₽",
        OrderResponse.status: lambda m, a: str(m.status),
        OrderResponse.technical_files: format_technical_files,
    }
    column_formatters_detail = {
        OrderResponse.proposed_sum_amount: lambda m, a: f"{m.proposed_sum_amount / 100:.2f} ₽" if m.proposed_sum_amount is not None else "0.00 ₽",
        OrderResponse.status: lambda m, a: str(m.status),
        OrderResponse.technical_files: format_technical_files,
    }

    column_labels = {
        OrderResponse.id: "ID",
        OrderResponse.order: "Заказ",
        OrderResponse.expert: "Эксперт",
        OrderResponse.comment: "Комментарий",
        OrderResponse.proposed_sum_amount: "Предложенная сумма",
        OrderResponse.proposed_deadline: "Предложенный дедлайн",
        OrderResponse.technical_files: "Тех. файлы",
        OrderResponse.expert_confirmed: "Эксперт подтвердил",
        OrderResponse.status: "Статус",
        OrderResponse.created_at: "Создан",
        OrderResponse.updated_at: "Обновлён",
        OrderResponse.reviews: "Отзывы",
    }


class ReviewAdmin(ModelView, model=Review):
    "Отзывы по завершённым сделкам: оценка от заказчика эксперту."

    name = "Отзыв"
    name_plural = "Отзывы"
    icon = "fa-solid fa-star"

    column_list = [
        Review.id, Review.customer, Review.expert,
        Review.rating, Review.comment, Review.created_at,
    ]
    column_searchable_list = [Review.comment]
    column_sortable_list = [Review.id, Review.rating, Review.created_at]
    column_default_sort = (Review.id, True)

    column_details_list = [
        Review.id, Review.order_id, Review.response,
        Review.customer, Review.expert,
        Review.rating, Review.comment, Review.created_at,
    ]

    form_columns = [
        Review.order_id, Review.response, Review.customer,
        Review.expert, Review.rating, Review.comment,
    ]

    column_labels = {
        Review.id: "ID",
        Review.order_id: "ID заказа",
        Review.response: "Отклик",
        Review.customer: "Заказчик",
        Review.expert: "Эксперт",
        Review.rating: "Оценка",
        Review.comment: "Комментарий",
        Review.created_at: "Создан",
    }
