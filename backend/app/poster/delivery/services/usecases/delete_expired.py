"""Автоудаление поста из каналов по сроку."""

from datetime import datetime

from app.poster.delivery.models import DeliveryStatus
from app.poster.delivery.services.publisher import TelegramPublisher
from app.poster.delivery.services.repo import DeliveryRepository


class DeleteExpiredUseCase:
    """Удаляет сообщения, у которых истёк срок, и помечает доставки удалёнными."""

    def __init__(self, deliveries: DeliveryRepository, publisher: TelegramPublisher) -> None:
        self.deliveries = deliveries
        self.publisher = publisher

    async def execute(self, now: datetime, limit: int) -> None:
        """Ошибку Telegram записывает в доставку: сообщение могло уже исчезнуть само."""

        for delivery in await self.deliveries.list_expired(now, limit):
            reply = await self.publisher.delete(delivery.channel.chat_id, delivery.message_ids)
            delivery.status = DeliveryStatus.DELETED
            delivery.error = reply.error

        await self.deliveries.save()
