import logging
from datetime import UTC, datetime

from src.core.database import SessionLocal
from src.core.telegram import get_telegram
from src.poster.channels.repository import ChannelRepository
from src.poster.delivery.publisher import TelegramPublisher
from src.poster.delivery.repository import DeliveryRepository
from src.poster.delivery.usecases.delete_expired_messages import DeleteExpiredMessagesUseCase
from src.poster.delivery.usecases.send_post import SendPostUseCase

logger = logging.getLogger(__name__)


async def send_ready_posts() -> None:
    """Отправляет в каналы все готовые посты. Если одна отправка упала, остальные всё равно уходят."""
    async with SessionLocal() as db:
        delivery_ids = await DeliveryRepository(db).list_ready_ids(datetime.now(UTC))

    publisher = TelegramPublisher(get_telegram())

    for delivery_id in delivery_ids:
        try:
            async with SessionLocal() as db:
                usecase = SendPostUseCase(DeliveryRepository(db), ChannelRepository(db), publisher)
                await usecase.execute(delivery_id=delivery_id)
                await db.commit()
        except Exception:
            logger.exception("Не удалось отправить доставку %s", delivery_id)


async def delete_expired_messages() -> None:
    """Удаляет из каналов посты, у которых истёк срок автоудаления. Worker запускает её раз в минуту."""
    async with SessionLocal() as db:
        usecase = DeleteExpiredMessagesUseCase(DeliveryRepository(db), TelegramPublisher(get_telegram()))
        await usecase.execute()
        await db.commit()
