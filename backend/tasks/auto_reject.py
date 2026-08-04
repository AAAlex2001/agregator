"Фоновая задача: авто-отклонение IN_PROGRESS откликов, не подтверждённых за 3 дня."
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
CHECK_INTERVAL_SECONDS = 3600
BACKOFF_INITIAL_SECONDS = 60
BACKOFF_MAX_SECONDS = 600


async def reject_expired_responses() -> None:
    "Отклоняет просроченные IN_PROGRESS отклики и возвращает заказы в ACTIVE."
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
            logger.info("Авто-отклонено просроченных IN_PROGRESS откликов: %d", len(expired))


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
            logger.info("Заархивировано заказов с истёкшим responses_deadline: %d", len(orders))


async def run_auto_reject_loop() -> None:
    "Вечный цикл: раз в час чистит отклики и заказы, при ошибке — экспоненциальный бэкофф."
    backoff_seconds = BACKOFF_INITIAL_SECONDS
    while True:
        try:
            await reject_expired_responses()
            await archive_orders_with_closed_responses()
            backoff_seconds = BACKOFF_INITIAL_SECONDS
            sleep_for = CHECK_INTERVAL_SECONDS
        except Exception:
            logger.exception("Ошибка в задаче авто-отклонения откликов")
            sleep_for = backoff_seconds
            backoff_seconds = min(backoff_seconds * 2, BACKOFF_MAX_SECONDS)
        await asyncio.sleep(sleep_for)
