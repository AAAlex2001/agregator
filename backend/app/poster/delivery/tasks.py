"""Фоновая отправка постов в Telegram. Безопасна при нескольких копиях бэкенда."""

import asyncio
import logging
from datetime import UTC, datetime, timedelta

from app.core.database import SessionLocal
from app.core.telegram import get_telegram_api
from app.poster.channels.services.repo import ChannelRepository
from app.poster.delivery.services.publisher import TelegramPublisher
from app.poster.delivery.services.repo import DeliveryRepository
from app.poster.delivery.services.usecases.send_delivery import SendDeliveryUseCase
from app.poster.publications.services.repo import PostRepository

logger = logging.getLogger(__name__)

BATCH_SIZE = 10
INTERVAL_SECONDS = 3
STUCK_AFTER = timedelta(minutes=10)


async def claim_deliveries() -> list[int]:
    """Возвращает зависшие доставки в очередь и забирает порцию ждущих."""

    now = datetime.now(UTC)

    async with SessionLocal() as db, db.begin():
        deliveries = DeliveryRepository(db)
        await deliveries.release_stuck(now - STUCK_AFTER)
        return await deliveries.claim(now, BATCH_SIZE)


async def send_delivery(delivery_id: int) -> None:
    """Одна доставка — одна транзакция: сбой в одном канале не мешает остальным."""

    publisher = TelegramPublisher(get_telegram_api())

    async with SessionLocal() as db, db.begin():
        usecase = SendDeliveryUseCase(
            DeliveryRepository(db),
            PostRepository(db),
            ChannelRepository(db),
            publisher,
        )
        await usecase.execute(delivery_id)


async def send_claimed() -> None:
    """Отправляет забранную порцию. Сбой одной доставки не останавливает остальные."""

    for delivery_id in await claim_deliveries():
        try:
            await send_delivery(delivery_id)
        except Exception:
            logger.exception("Не удалось отправить доставку %s", delivery_id)


async def run_delivery_loop() -> None:
    """Каждые несколько секунд отправляет новые посты в каналы."""

    while True:
        try:
            await send_claimed()
        except Exception:
            logger.exception("Ошибка очереди отправки постов в Telegram")

        await asyncio.sleep(INTERVAL_SECONDS)
