from datetime import UTC, datetime

from src.poster.delivery.models import DeliveryStatus
from src.poster.delivery.publisher import TelegramPublisher
from src.poster.delivery.repository import DeliveryRepository


class DeleteExpiredMessagesUseCase:
    """Автоудаление: автор попросил убрать пост из канала через несколько часов."""

    def __init__(self, deliveries: DeliveryRepository, publisher: TelegramPublisher) -> None:
        """Принимает доставки и отправителя в Telegram."""
        self.deliveries = deliveries
        self.publisher = publisher

    async def execute(self) -> None:
        """Удаляет из каналов посты, у которых наступило время удаления."""
        deliveries = await self.deliveries.list_expired(datetime.now(UTC))

        for delivery in deliveries:
            await self.publisher.delete(delivery.channel.chat_id, delivery.message_ids)
            delivery.status = DeliveryStatus.DELETED
            delivery.message_ids = []

        await self.deliveries.save()
