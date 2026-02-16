from datetime import date as date_type

from fastapi import APIRouter, Depends, File, Form, Header, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from models.response import ResponseStatus
from models.user import UserRole
from schemas.response import (
    ExpertResponseItem,
    ExpertResponseList,
    ResponseCreate,
    ResponseTab,
)
from services.commission import CommissionCalculator
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
    customer_company = ""
    order_sum = ""
    order_commission_amount = ""
    if order:
        customer_name = order.company or ""
        customer_company = order.company or ""
        order_sum = format_sum(order.sum_amount)
        order_commission_amount = format_sum(
            CommissionCalculator.commission_paid(order.sum_amount)
        )

    commission_paid_str: str | None = None
    balance_return_str: str | None = None
    if entity.status == ResponseStatus.ACCEPTED and order:
        paid = CommissionCalculator.commission_paid(order.sum_amount)
        returned = CommissionCalculator.balance_return(order.sum_amount)
        commission_paid_str = format_sum(paid)
        balance_return_str = format_sum(returned)

    return ExpertResponseItem(
        id=entity.id,
        order_id=entity.order_id,
        status=entity.status,
        date=entity.created_at.strftime("%d.%m.%Y"),
        comment=entity.comment,
        proposed_sum=format_sum(entity.proposed_sum_amount),
        proposed_deadline=entity.proposed_deadline.strftime("%d.%m.%Y"),
        order_title=order.title if order else "",
        order_sum=order_sum,
        order_date=order.deadline.strftime("%d.%m.%Y") if order else "",
        customer_name=customer_name,
        customer_company=customer_company,
        technical_files=order.technical_files if order and order.technical_files else [],
        response_files=entity.technical_files if entity.technical_files else [],
        badges=[
            {"text": badge.text, "variant": badge.variant.value}
            for badge in (order.badges if order else [])
        ],
        created_at=entity.created_at,
        order_commission_amount=order_commission_amount,
        commission_paid=commission_paid_str,
        balance_return=balance_return_str,
        proposed_sum_amount_raw=entity.proposed_sum_amount,
        proposed_deadline_raw=entity.proposed_deadline.isoformat(),
    )


@router.post("/orders/{order_id}/responses", response_model=ExpertResponseItem)
async def create_response_for_order(
    order_id: int,
    comment: str = Form(""),
    proposed_sum_amount: int = Form(...),
    proposed_deadline: str = Form(...),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    data = ResponseCreate(
        comment=comment,
        proposed_sum_amount=proposed_sum_amount,
        proposed_deadline=date_type.fromisoformat(proposed_deadline),
    )
    service = ResponseService(db)
    created = await service.create_response(order_id=order_id, expert_id=x_user_id, data=data)

    if files and files[0].filename:
        created = await service.upload_response_files(
            response_id=created.id,
            expert_id=x_user_id,
            files=files,
        )

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
    actor = await service.get_actor(x_user_id)
    if actor.role == UserRole.CUSTOMER:
        items, total, counters = await service.list_customer_responses(
            customer_id=x_user_id,
            tab=tab,
            skip=skip,
            limit=limit,
        )
    else:
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


@router.put("/responses/{response_id}", response_model=ExpertResponseItem)
async def update_response(
    response_id: int,
    comment: str = Form(""),
    proposed_sum_amount: int = Form(...),
    proposed_deadline: str = Form(...),
    keep_files: str = Form(default="[]"),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    import json as _json
    try:
        keep_files_list: list[str] = _json.loads(keep_files)
    except (ValueError, TypeError):
        keep_files_list = []

    data = ResponseCreate(
        comment=comment,
        proposed_sum_amount=proposed_sum_amount,
        proposed_deadline=date_type.fromisoformat(proposed_deadline),
    )
    service = ResponseService(db)
    updated = await service.update_response(
        response_id=response_id, expert_id=x_user_id, data=data,
        keep_files=keep_files_list,
    )

    if files and files[0].filename:
        updated = await service.upload_response_files(
            response_id=updated.id, expert_id=x_user_id, files=files,
        )

    return to_item(updated)


@router.delete("/responses/{response_id}")
async def withdraw_response(
    response_id: int,
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    service = ResponseService(db)
    await service.withdraw_response(response_id=response_id, expert_id=x_user_id)
    return {"detail": "Отклик отозван"}
