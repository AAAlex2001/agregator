"""Названия статусов и адресаты для уведомлений и писем."""

from app.blitz.orders.models import BlitzOrder, OrderStatus
from models.account import Account

STATUS_TITLES = {
    OrderStatus.NEW: "Ждёт эксперта",
    OrderStatus.EXPERT_READY: "Эксперт готов, подпишите договор",
    OrderStatus.CONTRACT: "Договор подписан, ждём аванс",
    OrderStatus.IN_PROGRESS: "Аванс оплачен, эксперт работает",
    OrderStatus.REMARKS: "Замечания эксперта",
    OrderStatus.CONCLUSION_READY: "Заключение готово, ждём остаток",
    OrderStatus.PAID: "Оплачено полностью",
    OrderStatus.SENT: "Заключение отправлено",
    OrderStatus.ACCEPTED: "Работа принята",
    OrderStatus.CANCELED: "Заявка отменена",
}


def status_title(status: str) -> str:
    """Название статуса для людей."""

    return STATUS_TITLES[OrderStatus(status)]


def parties(order: BlitzOrder) -> list[Account]:
    """Заказчик и эксперт заявки, если он назначен."""

    return [account for account in (order.customer, order.expert) if account]
