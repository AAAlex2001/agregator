from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from models.order import OrderStatus
from schemas.order import (
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
):
    service = OrderService(db)
    orders, total = await service.get_orders(skip, limit, status)
    return OrderListResponse(
        items=[OrderResponse.from_order(o) for o in orders],
        total=total,
    )


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


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    data: OrderUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    order = await service.update_order(order_id, data)
    return OrderResponse.from_order(order)


@router.delete("/{order_id}", response_model=OrderResponse)
async def delete_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    order = await service.delete_order(order_id)
    return OrderResponse.from_order(order)
