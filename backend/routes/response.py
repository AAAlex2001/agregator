from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from models.response import ResponseStatus
from schemas.response import (
    ExpertResponseItem,
    ExpertResponseList,
    ResponseCreate,
    ResponseTab,
)
from services.response import ResponseService

router = APIRouter(tags=["responses"])


def format_sum(sum_amount: int) -> str:
    roubles = sum_amount // 100
    formatted = f"{roubles:,}".replace(",", " ")
    if sum_amount % 100:
        return f"{formatted},{sum_amount % 100:02d} ₽"
    return f"{formatted} ₽"


def to_item(entity) -> ExpertResponseItem:
    order = entity.order
    customer_name = ""
    if order and order.customer:
        customer_name = order.customer.email or order.customer.phone or ""

    return ExpertResponseItem(
        id=entity.id,
        order_id=entity.order_id,
        status=entity.status,
        date=entity.created_at.strftime("%d.%m.%Y"),
        comment=entity.comment,
        proposed_sum=format_sum(entity.proposed_sum_amount),
        proposed_deadline=entity.proposed_deadline.strftime("%d.%m.%Y"),
        order_title=order.title if order else "",
        order_date=order.deadline.strftime("%d.%m.%Y") if order else "",
        customer_name=customer_name,
        technical_files=order.technical_files if order and order.technical_files else [],
        badges=[
            {"text": badge.text, "variant": badge.variant.value}
            for badge in (order.badges if order else [])
        ],
        created_at=entity.created_at,
    )


@router.post("/orders/{order_id}/responses", response_model=ExpertResponseItem)
async def create_response_for_order(
    order_id: int,
    data: ResponseCreate,
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    service = ResponseService(db)
    created = await service.create_response(order_id=order_id, expert_id=x_user_id, data=data)
    return to_item(created)


@router.get("/responses", response_model=ExpertResponseList)
async def get_my_responses(
    tab: ResponseTab | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    service = ResponseService(db)
    items, total, counters = await service.list_responses(
        expert_id=x_user_id,
        tab=tab,
        skip=skip,
        limit=limit,
    )
    return ExpertResponseList(
        items=[to_item(item) for item in items],
        total=total,
        counters=counters,
    )


@router.patch("/responses/{response_id}/status", response_model=ExpertResponseItem)
async def update_response_status(
    response_id: int,
    new_status: ResponseStatus,
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    service = ResponseService(db)
    updated = await service.update_response_status(
        response_id=response_id,
        actor_id=x_user_id,
        new_status=new_status,
    )
    return to_item(updated)
