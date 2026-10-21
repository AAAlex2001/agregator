"""Слова для истории, уведомлений, писем и документов: у экспертизы и аудита они разные."""

from dataclasses import dataclass

from app.blitz.orders.models import BlitzOrder, OrderStatus, ServiceKind
from models.account import Account

STATUS_TITLES = {
    OrderStatus.NEW: "Ждёт эксперта",
    OrderStatus.CONSULTATION: "Нужна консультация",
    OrderStatus.OFFER: "Аудитор предложил цену",
    OrderStatus.COUNTER: "Заказчик предложил свою цену",
    OrderStatus.EXPERT_READY: "Эксперт готов, подпишите договор",
    OrderStatus.CONTRACT: "Договор подписан, ждём аванс",
    OrderStatus.PLAN: "Аванс оплачен, готовится План аудита",
    OrderStatus.PLAN_REVIEW: "План аудита на согласовании",
    OrderStatus.IN_PROGRESS: "Аванс оплачен, эксперт работает",
    OrderStatus.REMARKS: "Замечания эксперта",
    OrderStatus.CONCLUSION_READY: "Заключение готово, ждём остаток",
    OrderStatus.PAID: "Оплачено полностью",
    OrderStatus.SENT: "Заключение отправлено",
    OrderStatus.ACCEPTED: "Работа принята",
    OrderStatus.CANCELED: "Заявка отменена",
}


@dataclass(frozen=True)
class Wording:
    """Формы слов, которые меняются от сервиса к сервису."""

    executor: str
    work: str
    result: str
    subject: str


EXPERTISE_WORDING = Wording(
    executor="Эксперт",
    work="экспертизу",
    result="заключение",
    subject="Экспертиза промышленной безопасности",
)

AUDIT_WORDING = Wording(
    executor="Аудитор",
    work="аудит СУПБ",
    result="отчёт об аудите",
    subject="Аудит системы управления промышленной безопасностью",
)


def wording_for(order: BlitzOrder) -> Wording:
    """Формулировки под сервис заявки."""

    return AUDIT_WORDING if order.service == ServiceKind.AUDIT else EXPERTISE_WORDING


def status_title(status: str) -> str:
    """Название статуса для людей."""

    return STATUS_TITLES[OrderStatus(status)]


def parties(order: BlitzOrder) -> list[Account]:
    """Заказчик и исполнитель заявки, если он назначен."""

    return [account for account in (order.customer, order.expert) if account]
