"""Заявка в ответе API с учётом того, кто смотрит.

Реквизиты, счета и платёжные документы видят заказчик, исполнитель, аудиторы группы и администратор.
Эксперт, который только выбирает заявку, видит документацию, но не данные заказчика.
Заказчик аудита узнаёт ФИО аудиторов из Плана: до него исполнитель для него — «Аудитор платформы».
"""

from app.blitz.audit.services.auditors import team_of
from app.blitz.billing.services.stages import amount_due, current_stage
from app.blitz.documents.models import DocumentKind
from app.blitz.orders.models import BlitzOrder, CustomerType, ServiceKind
from app.blitz.orders.schemas import (
    CompanySchema,
    DocumentSchema,
    IndividualSchema,
    OrderSchema,
    OrderSummarySchema,
)
from app.blitz.orders.services.access import in_team
from models.account import Account

PUBLIC_KINDS = frozenset({DocumentKind.DOCUMENTATION, DocumentKind.AUDIT_ITEM})
HIDDEN_AUDITOR = "Аудитор платформы"


def executors_visible(order: BlitzOrder, viewer: Account | None) -> bool:
    """Видны ли ФИО исполнителей. Заказчик аудита видит их после отправки Плана."""

    if viewer is None or order.service != ServiceKind.AUDIT or viewer.id != order.customer_id:
        return True

    return order.audit_plan is not None


def executor_name(order: BlitzOrder, viewer: Account | None) -> str | None:
    """Имя исполнителя для того, кто смотрит."""

    if order.expert is None:
        return None

    return order.expert.display_name if executors_visible(order, viewer) else HIDDEN_AUDITOR


def summary(order: BlitzOrder, viewer: Account | None) -> OrderSummarySchema:
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
        expert_name=executor_name(order, viewer),
        created_at=order.created_at,
        updated_at=order.updated_at,
    )


def is_party(order: BlitzOrder, viewer: Account | None) -> bool:
    """Смотрит заказчик, исполнитель или аудитор группы. None — администратор."""

    if viewer is None:
        return True

    return viewer.id in (order.customer_id, order.expert_id) or in_team(order, viewer)


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
        **summary(order, viewer).model_dump(),
        hazard_class=order.hazard_class,
        expert_category=order.expert_category,
        contract_kind=order.contract_kind,
        comment=order.comment,
        result=order.result,
        cancel_reason=order.cancel_reason,
        customer_name=order.customer.display_name,
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
        offer_price=order.offer_price,
        counter_price=order.counter_price,
        audit_details=order.audit_details,
        audit_plan=order.audit_plan,
        plan_comment=order.plan_comment,
        team=team_of(order) if executors_visible(order, viewer) else [],
    )
