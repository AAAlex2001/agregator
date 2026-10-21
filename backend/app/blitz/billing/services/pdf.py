"""Счёт и акт в PDF: HTML-шаблон с реквизитами и суммой прописью."""

from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from starlette.concurrency import run_in_threadpool
from weasyprint import HTML

from app.blitz.billing.models import Invoice, PaymentStage
from app.blitz.billing.services.stages import STAGE_TITLES
from app.blitz.company import COMPANY, vat_rate
from app.blitz.orders.models import BlitzOrder, OrderStatus
from app.core.money import amount_in_words, format_amount, vat_included

TEMPLATES = Path(__file__).resolve().parents[1] / "templates"

environment = Environment(loader=FileSystemLoader(str(TEMPLATES)), autoescape=select_autoescape(["html"]))
environment.filters["amount"] = format_amount


@dataclass(frozen=True)
class Payer:
    """Заказчик в документе: как подписан и где зарегистрирован."""

    name: str
    details: str
    address: str


@dataclass(frozen=True)
class Totals:
    """Сумма документа: цифрами, прописью и НДС."""

    amount: Decimal
    words: str
    vat_rate: int
    vat: Decimal


def totals(amount: Decimal) -> Totals:
    """Итог с НДС «в том числе» по ставке из окружения."""

    rate = vat_rate()

    return Totals(amount=amount, words=amount_in_words(amount), vat_rate=rate, vat=vat_included(amount, rate))


def payer_of(order: BlitzOrder) -> Payer:
    """Организация с ИНН и КПП или физлицо с паспортом."""

    if order.company is not None:
        company = order.company
        details = f"{company.name}, ИНН {company.inn}, КПП {company.kpp or '—'}"
        return Payer(company.name, details, company.address)

    if order.individual is not None:
        person = order.individual
        details = f"{person.full_name}, паспорт {person.passport_number}"
        return Payer(person.full_name, details, person.address)

    return Payer(order.customer.display_name, order.customer.display_name, "—")


def work_subject(order: BlitzOrder) -> str:
    """Наименование работ в счёте и акте."""

    return f"Экспертиза промышленной безопасности «{order.object_name}» по заявке №{order.id}"


async def render(template: str, context: dict[str, object]) -> bytes:
    """HTML из шаблона в PDF. Вёрстка тяжёлая, поэтому вне цикла событий."""

    html = environment.get_template(template).render(company=COMPANY, **context)

    return await run_in_threadpool(HTML(string=html).write_pdf)


async def invoice_pdf(invoice: Invoice, order: BlitzOrder) -> bytes:
    """Счёт на оплату этапа."""

    stage_title = STAGE_TITLES[PaymentStage(invoice.stage)]

    return await render(
        "invoice.html",
        {
            "invoice": invoice,
            "subject": f"{stage_title}. {work_subject(order)}",
            "totals": totals(invoice.amount),
        },
    )


async def act_pdf(order: BlitzOrder) -> bytes:
    """Акт сдачи-приёмки на всю стоимость работ."""

    return await render(
        "act.html",
        {
            "order": order,
            "number": act_number(order),
            "signed_at": order.reached_at(OrderStatus.ACCEPTED) or order.created_at,
            "payer": payer_of(order),
            "subject": work_subject(order),
            "totals": totals(order.price),
        },
    )


def act_number(order: BlitzOrder) -> str:
    """Номер акта: год приёмки и номер заявки."""

    accepted = order.reached_at(OrderStatus.ACCEPTED) or order.created_at

    return f"{accepted.year}-{order.id:04d}"
