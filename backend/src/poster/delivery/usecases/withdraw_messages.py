from src.poster.delivery.publisher import TelegramPublisher
from src.poster.delivery.repository import DeliveryRepository


class WithdrawMessagesUseCase:
    """Автор удаляет пост и просит убрать его и из Telegram-каналов."""

    def __init__(self, deliveries: DeliveryRepository, publisher: TelegramPublisher) -> None:
        """Принимает доставки и отправителя в Telegram."""
        self.deliveries = deliveries
        self.publisher = publisher

    async def execute(self, *, post_id: int) -> None:
        """Удаляет сообщения поста во всех каналах, куда он уже отправлен."""
        deliveries = await self.deliveries.list_sent(post_id)

        for delivery in deliveries:
            await self.publisher.delete(delivery.channel.chat_id, delivery.message_ids)
