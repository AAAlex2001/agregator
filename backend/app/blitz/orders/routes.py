"""Заявки Блиц-эксперта в кабинете заказчика и эксперта."""

from datetime import date

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from pydantic import Json

from app.auth.sessions.dependencies import require_user
from app.blitz.orders.dependencies import (
    get_accept_order_usecase,
    get_auditor,
    get_cancel_order_usecase,
    get_create_order_usecase,
    get_locked_order,
    get_order_repository,
    get_viewed_order,
)
from app.blitz.orders.models import BlitzOrder, CustomerType, ServiceKind
from app.blitz.orders.schemas import (
    AcceptOrderSchema,
    CancelOrderSchema,
    CatalogSchema,
    CompanySchema,
    IndividualSchema,
    OrderCreateSchema,
    OrderSchema,
    OrderSummarySchema,
    RequisitesSchema,
)
from app.blitz.orders.services.access import can_take
from app.blitz.orders.services.presenter import details, summary
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.usecases.accept_order import AcceptOrderUseCase
from app.blitz.orders.services.usecases.cancel_order import CancelOrderUseCase
from app.blitz.orders.services.usecases.create_order import CreateOrderUseCase
from app.blitz.orders.services.validators import require_customer, require_expert
from models.account import Account

router = APIRouter(tags=["blitz"])


@router.get("/catalog")
async def get_catalog() -> CatalogSchema:
    """Области аттестации, объекты экспертизы, виды договора и сроки."""

    return CatalogSchema.build()


@router.get("/orders/requisites")
async def get_last_requisites(
    user: Account = Depends(require_user),
    orders: OrderRepository = Depends(get_order_repository),
) -> RequisitesSchema:
    """Реквизиты из последней заявки заказчика для новой."""

    last = await orders.last_for_customer(user.id)
    if last is None:
        return RequisitesSchema()

    return RequisitesSchema(
        customer_type=CustomerType(last.customer_type),
        company=CompanySchema.model_validate(last.company) if last.company else None,
        individual=IndividualSchema.model_validate(last.individual) if last.individual else None,
    )


@router.post("/orders", status_code=201)
async def create_order(
    payload: Json[OrderCreateSchema] = Form(...),
    files: list[UploadFile] = File(default=[]),
    company_card: UploadFile | None = File(None),
    user: Account = Depends(require_user),
    usecase: CreateOrderUseCase = Depends(get_create_order_usecase),
) -> OrderSchema:
    """Новая заявка: данные в поле payload, документация в files, карточка организации отдельно."""

    order = await usecase.execute(user, payload, files, company_card)

    return details(order, user)


@router.get("/orders/my")
async def list_my_orders(
    service: ServiceKind = Query(ServiceKind.EXPERTISE),
    user: Account = Depends(require_user),
    orders: OrderRepository = Depends(get_order_repository),
) -> list[OrderSummarySchema]:
    """Заявки заказчика на экспертизу или аудит."""

    require_customer(user)

    return [summary(order, user) for order in await orders.list_for_customer(user.id, service)]


@router.get("/orders/incoming")
async def list_incoming_orders(
    service: ServiceKind = Query(ServiceKind.EXPERTISE),
    user: Account = Depends(require_user),
    auditor: bool = Depends(get_auditor),
    orders: OrderRepository = Depends(get_order_repository),
) -> list[OrderSummarySchema]:
    """Новые заявки, которые эксперт может взять: экспертизы — по удостоверениям, аудит — аудитор."""

    require_expert(user)
    today = date.today()

    incoming = await orders.list_unassigned(service)

    return [summary(order, user) for order in incoming if can_take(order, user, today, auditor)]


@router.get("/orders/assigned")
async def list_assigned_orders(
    service: ServiceKind = Query(ServiceKind.EXPERTISE),
    user: Account = Depends(require_user),
    orders: OrderRepository = Depends(get_order_repository),
) -> list[OrderSummarySchema]:
    """Заявки, которые эксперт взял в работу или где он в аудиторской группе."""

    require_expert(user)

    return [summary(order, user) for order in await orders.list_for_expert(user.id, service)]


@router.get("/orders/{order_id}")
async def get_order(
    order: BlitzOrder = Depends(get_viewed_order),
    user: Account = Depends(require_user),
) -> OrderSchema:
    """Заявка целиком."""

    return details(order, user)


@router.post("/orders/{order_id}/accept")
async def accept_order(
    data: AcceptOrderSchema,
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    auditor: bool = Depends(get_auditor),
    usecase: AcceptOrderUseCase = Depends(get_accept_order_usecase),
) -> OrderSchema:
    """Эксперт или аудитор готов провести работу по цене заказчика."""

    return details(await usecase.execute(user, order, data.contract_kind, auditor), user)


@router.post("/orders/{order_id}/cancel")
async def cancel_order(
    data: CancelOrderSchema,
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: CancelOrderUseCase = Depends(get_cancel_order_usecase),
) -> OrderSchema:
    """Заказчик отменяет заявку до подписания договора."""

    return details(await usecase.by_customer(user, order, data.reason), user)
