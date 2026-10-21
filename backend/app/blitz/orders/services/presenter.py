"""Заявка в ответе API с учётом того, кто смотрит.

Реквизиты, счета и платёжные документы видят заказчик, назначенный эксперт и администратор.
Эксперт, который только выбирает заявку, видит документацию, но не данные заказчика.
"""

from app.blitz.billing.services.stages import amount_due, current_stage
from app.blitz.documents.models import DocumentKind
from app.blitz.orders.models import BlitzOrder, CustomerType
from app.blitz.orders.schemas import (
    CompanySchema,
    DocumentSchema,
    IndividualSchema,
    OrderSchema,
    OrderSummarySchema,
)
from models.account import Account

PUBLIC_KINDS = frozenset({DocumentKind.DOCUMENTATION})


def person_name(account: Account | None) -> str | None:
    """Имя для карточки заявки."""

    return account.display_name if account else None


def summary(order: BlitzOrder) -> OrderSummarySchema:
    """Заявка для списка."""

    return OrderSummarySchema(
        id=order.id,
        service=order.service,
        status=order.status,
        object_name=order.object_name,
        object_code=order.object_code,
        area_code=order.area_code,
        deadline=order.deadline,
        price=order.price,
        customer_type=CustomerType(order.customer_type),
        expert_name=person_name(order.expert),
        created_at=order.created_at,
        updated_at=order.updated_at,
    )


def is_party(order: BlitzOrder, viewer: Account | None) -> bool:
    """Смотрит заказчик или назначенный эксперт. None — администратор."""

    if viewer is None:
        return True

    return viewer.id in (order.customer_id, order.expert_id)


def sees_passport(order: BlitzOrder, viewer: Account | None) -> bool:
    """Паспорт физлица видят только сам заказчик и администратор."""

    return viewer is None or viewer.id == order.customer_id


def details(order: BlitzOrder, viewer: Account | None) -> OrderSchema:
    """Заявка целиком для участника или администратора."""

    party = is_party(order, viewer)
    stage = current_stage(order)
    documents = [item for item in order.documents if party or item.kind in PUBLIC_KINDS]
    company = CompanySchema.model_validate(order.company) if party and order.company else None
    individual = order.individual if sees_passport(order, viewer) else None

    return OrderSchema(
        **summary(order).model_dump(),
        hazard_class=order.hazard_class,
        expert_category=order.expert_category,
        contract_kind=order.contract_kind,
        comment=order.comment,
        result=order.result,
        cancel_reason=order.cancel_reason,
        customer_name=person_name(order.customer) or "—",
        paid_amount=order.paid_amount,
        stage=stage,
        amount_due=amount_due(order, stage) if stage else None,
        company=company,
        individual=IndividualSchema.model_validate(individual) if individual else None,
        documents=[DocumentSchema.model_validate(item) for item in documents],
        remarks=order.remarks if party else [],
        history=order.history,
        price_changes=order.price_changes if party else [],
        invoices=order.invoices if party else [],
    )
