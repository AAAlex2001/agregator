"""Background task: auto-reject IN_PROGRESS responses not confirmed within 3 days."""
import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database.database import AsyncSessionLocal
from models.order import Order, OrderStatus
from models.response import OrderResponse, ResponseStatus

logger = logging.getLogger(__name__)

AUTO_REJECT_DAYS = 3
CHECK_INTERVAL_SECONDS = 3600  # hourly


async def reject_expired_responses() -> None:
    cutoff = datetime.now(timezone.utc) - timedelta(days=AUTO_REJECT_DAYS)

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
                if response.order.status != OrderStatus.COMPLETED:
                    response.order.status = OrderStatus.ACTIVE

        if expired:
            await db.commit()
            logger.info("Auto-rejected %d expired IN_PROGRESS responses", len(expired))


async def run_auto_reject_loop() -> None:
    while True:
        try:
            await reject_expired_responses()
        except Exception:
            logger.exception("Error in auto-reject task")
        await asyncio.sleep(CHECK_INTERVAL_SECONDS)
