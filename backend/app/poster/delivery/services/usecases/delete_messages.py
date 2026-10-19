"""Удаление сообщений поста из Telegram-каналов."""

from app.poster.delivery.models import DeliveryStatus
from app.poster.delivery.services.publisher import TelegramPublisher
from app.poster.publications.models import Post


class DeleteMessagesUseCase:
    """Удаляет пост из всех каналов, куда он ушёл. Ошибки Telegram не мешают удалить пост на сайте."""

    def __init__(self, publisher: TelegramPublisher) -> None:
        self.publisher = publisher

    async def execute(self, post: Post) -> None:
        """Сообщения старше 48 часов в группах Telegram удалить не даёт — они останутся."""

        sent = [delivery for delivery in post.deliveries if delivery.status == DeliveryStatus.SENT]

        for delivery in sent:
            await self.publisher.delete(delivery.channel.chat_id, delivery.message_ids)
            delivery.status = DeliveryStatus.DELETED
