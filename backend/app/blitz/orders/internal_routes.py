"""Заявки Блиц-эксперта в админке: список, карточка, статус, эксперт, отмена, удаление."""

from datetime import date

from fastapi import APIRouter, Depends, Query, Response

from app.blitz.audit.services.repo import AuditRepository
from app.blitz.orders.dependencies import (
    get_admin_order,
    get_assign_expert_usecase,
    get_audit_repository,
    get_cancel_order_usecase,
    get_delete_order_usecase,
    get_order_repository,
    get_set_order_status_usecase,
)
from app.blitz.orders.models import BlitzOrder, OrderStatus, ServiceKind
from app.blitz.orders.schemas import (
    AssignExpertSchema,
    CancelOrderSchema,
    ExpertOptionSchema,
    OrderPageSchema,
    OrderSchema,
    SetStatusSchema,
)
from app.blitz.orders.services.matching import expert_fits
from app.blitz.orders.services.presenter import details
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.usecases.assign_expert import AssignExpertUseCase
from app.blitz.orders.services.usecases.cancel_order import CancelOrderUseCase
from app.blitz.orders.services.usecases.delete_order import DeleteOrderUseCase
from app.blitz.orders.services.usecases.set_order_status import SetOrderStatusUseCase

router = APIRouter(tags=["admin-blitz"])


@router.get("/orders")
async def list_orders(
    statuses: list[OrderStatus] = Query([], alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    orders: OrderRepository = Depends(get_order_repository),
) -> OrderPageSchema:
    """Заявки, новые первыми. Можно отфильтровать по нескольким статусам."""

    items, total = await orders.page(statuses, limit, offset)

    return OrderPageSchema(items=[details(order, None) for order in items], total=total)


@router.get("/orders/{order_id}")
async def get_order(order: BlitzOrder = Depends(get_admin_order)) -> OrderSchema:
    """Заявка со всеми файлами, счетами и историей."""

    return details(order, None)


@router.get("/orders/{order_id}/experts")
async def list_fitting_experts(
    order: BlitzOrder = Depends(get_admin_order),
    orders: OrderRepository = Depends(get_order_repository),
    audits: AuditRepository = Depends(get_audit_repository),
) -> list[ExpertOptionSchema]:
    """Исполнители для назначения: сначала подходящие. Аудит проводят только руководители групп."""

    if order.service == ServiceKind.AUDIT:
        leads = await audits.list_leads()
        options = [ExpertOptionSchema(id=lead.id, name=lead.display_name, fits=True) for lead in leads]

        return sorted(options, key=lambda option: option.name)

    today = date.today()
    experts = await orders.list_experts_with_certificates()
    options = [
        ExpertOptionSchema(id=expert.id, name=expert.display_name, fits=expert_fits(expert, order, today))
        for expert in experts
    ]

    return sorted(options, key=lambda option: (not option.fits, option.name))


@router.post("/orders/{order_id}/status")
async def set_status(
    data: SetStatusSchema,
    order: BlitzOrder = Depends(get_admin_order),
    usecase: SetOrderStatusUseCase = Depends(get_set_order_status_usecase),
) -> OrderSchema:
    """Поставить статус вручную с пояснением для истории."""

    return details(await usecase.execute(order, data.status, data.note), None)


@router.post("/orders/{order_id}/expert")
async def assign_expert(
    data: AssignExpertSchema,
    order: BlitzOrder = Depends(get_admin_order),
    usecase: AssignExpertUseCase = Depends(get_assign_expert_usecase),
) -> OrderSchema:
    """Назначить исполнителя до подписания договора."""

    return details(await usecase.execute(order, data.expert_id, data.contract_kind), None)


@router.post("/orders/{order_id}/cancel")
async def cancel_order(
    data: CancelOrderSchema,
    order: BlitzOrder = Depends(get_admin_order),
    usecase: CancelOrderUseCase = Depends(get_cancel_order_usecase),
) -> OrderSchema:
    """Отменить незавершённую заявку."""

    return details(await usecase.by_admin(order, data.reason), None)


@router.delete("/orders/{order_id}", status_code=204)
async def delete_order(
    order: BlitzOrder = Depends(get_admin_order),
    usecase: DeleteOrderUseCase = Depends(get_delete_order_usecase),
) -> Response:
    """Удалить заявку вместе с файлами."""

    await usecase.execute(order)

    return Response(status_code=204)
