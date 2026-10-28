from src.poster.delivery.publisher import TelegramPublisher
from src.poster.delivery.repository import DeliveryRepository
from src.poster.posts.models import Post


class EditSentMessagesUseCase:
    """Автор изменил пост, который уже вышел в каналах."""

    def __init__(self, deliveries: DeliveryRepository, publisher: TelegramPublisher) -> None:
        """Принимает доставки и отправителя в Telegram."""
        self.deliveries = deliveries
        self.publisher = publisher

    async def execute(self, *, post: Post) -> None:
        """Меняет текст и кнопки поста во всех каналах, куда он уже отправлен."""
        deliveries = await self.deliveries.list_sent(post.id)

        for delivery in deliveries:
            await self.publisher.edit(post, delivery.channel.chat_id, delivery.message_ids)
