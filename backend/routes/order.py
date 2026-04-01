import json
from datetime import date as date_type, datetime as datetime_type
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.order import OrderStatus
from schemas.order import (
    BadgeSchema,
    OrderCreate,
    OrderUpdate,
    OrderResponse,
    OrderListResponse,
)
from services.order import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=OrderListResponse)
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[OrderStatus] = None,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = OrderService(db)
    orders, total = await service.get_orders(skip, limit, status, user_id)
    return OrderListResponse(
        items=[OrderResponse.from_order(o) for o in orders],
        total=total,
    )


@router.get("/public/{public_id}", response_model=OrderResponse)
async def get_order_public(
    public_id: str,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    order = await service.get_order_by_public_id(public_id)
    return OrderResponse.from_order(order)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    order = await service.get_order_by_id(order_id)
    return OrderResponse.from_order(order)


@router.post("/", response_model=OrderResponse)
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    order = await service.create_order(data)
    return OrderResponse.from_order(order)


@router.post("/create-with-files", response_model=OrderResponse)
async def create_order_with_files(
    title: str = Form(...),
    company: str = Form(""),
    typical_names: str = Form(""),
    comment: str = Form(""),
    customer_id: int = Form(...),
    sum_amount: int = Form(...),
    deadline: str = Form(...),
    responses_deadline: str = Form(""),
    badges_json: str = Form("[]"),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
):
    try:
        badge_list = json.loads(badges_json)
    except json.JSONDecodeError:
        badge_list = []

    badges = [
        BadgeSchema(text=b["text"], variant=b["variant"])
        for b in badge_list
    ]

    parsed_responses_deadline = None
    if responses_deadline:
        parsed_responses_deadline = datetime_type.fromisoformat(responses_deadline)

    data = OrderCreate(
        title=title,
        company=company,
        typical_names=typical_names,
        comment=comment,
        customer_id=customer_id,
        sum_amount=sum_amount,
        deadline=date_type.fromisoformat(deadline),
        responses_deadline=parsed_responses_deadline,
        badges=badges,
    )

    service = OrderService(db)
    order = await service.create_order(data, files=files if files else None)
    return OrderResponse.from_order(order)


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    data: OrderUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    order = await service.update_order(order_id, data)
    return OrderResponse.from_order(order)


@router.patch("/{order_id}/update-with-files", response_model=OrderResponse)
async def update_order_with_files(
    order_id: int,
    title: str = Form(...),
    company: str = Form(""),
    typical_names: str = Form(""),
    comment: str = Form(""),
    sum_amount: int = Form(...),
    deadline: str = Form(...),
    responses_deadline: str = Form(""),
    badges_json: str = Form("[]"),
    keep_files: str = Form("[]"),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    try:
        badge_list = json.loads(badges_json)
    except json.JSONDecodeError:
        badge_list = []

    try:
        keep_list = json.loads(keep_files)
    except json.JSONDecodeError:
        keep_list = []

    badges = [
        BadgeSchema(text=b["text"], variant=b["variant"])
        for b in badge_list
    ]

    parsed_responses_deadline = None
    if responses_deadline:
        parsed_responses_deadline = datetime_type.fromisoformat(responses_deadline)

    data = OrderUpdate(
        title=title,
        company=company,
        typical_names=typical_names,
        comment=comment,
        sum_amount=sum_amount,
        deadline=date_type.fromisoformat(deadline),
        responses_deadline=parsed_responses_deadline,
        badges=badges,
        technical_files=keep_list,
    )

    service = OrderService(db)
    order = await service.update_order_with_files(order_id, data, files=files if files else None)
    return OrderResponse.from_order(order)


@router.post("/{order_id}/files", response_model=OrderResponse)
async def upload_order_files(
    order_id: int,
    files: list[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    order = await service.upload_order_files(order_id, files)
    return OrderResponse.from_order(order)


@router.delete("/{order_id}")
async def delete_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    await service.delete_order(order_id)
    return {"ok": True}
