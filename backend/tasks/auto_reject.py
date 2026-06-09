"""Background task: auto-reject IN_PROGRESS responses not confirmed within 3 days."""
import asyncio
import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database.database import AsyncSessionLocal
from models.order import Order, OrderStatus
from models.response import OrderResponse, ResponseStatus

logger = logging.getLogger(__name__)

AUTO_REJECT_DAYS = 3
CHECK_INTERVAL_SECONDS = 3600  # hourly
BACKOFF_INITIAL_SECONDS = 60
BACKOFF_MAX_SECONDS = 600


async def reject_expired_responses() -> None:
    cutoff = datetime.now(UTC) - timedelta(days=AUTO_REJECT_DAYS)

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(OrderResponse)
            .options(selectinload(OrderResponse.order))
            .where(
                OrderResponse.status == ResponseStatus.IN_PROGRESS,
                OrderResponse.updated_at < cutoff,
            )
        )
        expired = result.scalars().all()

        for response in expired:
            response.status = ResponseStatus.REJECTED
            if response.order and response.order.assigned_expert_id == response.expert_id:
                response.order.assigned_expert_id = None
                if response.order.status != OrderStatus.ARCHIVED:
                    response.order.status = OrderStatus.ACTIVE

        if expired:
            await db.commit()
            logger.info("Auto-rejected %d expired IN_PROGRESS responses", len(expired))


async def archive_orders_with_closed_responses() -> None:
    "Архивирует заказы, у которых истёк срок приёма откликов (responses_deadline в прошлом)."
    now = datetime.now(UTC)
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Order).where(
                Order.status == OrderStatus.ACTIVE,
                Order.responses_deadline.is_not(None),
                Order.responses_deadline < now,
            )
        )
        orders = result.scalars().all()

        for order in orders:
            order.status = OrderStatus.ARCHIVED

        if orders:
            await db.commit()
            logger.info("Archived %d orders with expired responses_deadline", len(orders))


async def run_auto_reject_loop() -> None:
    backoff_seconds = BACKOFF_INITIAL_SECONDS
    while True:
        try:
            await reject_expired_responses()
            await archive_orders_with_closed_responses()
            backoff_seconds = BACKOFF_INITIAL_SECONDS
            sleep_for = CHECK_INTERVAL_SECONDS
        except Exception:
            logger.exception("Error in auto-reject task")
            sleep_for = backoff_seconds
            backoff_seconds = min(backoff_seconds * 2, BACKOFF_MAX_SECONDS)
        await asyncio.sleep(sleep_for)
