"""Правка уже вышедших в Telegram сообщений поста."""

from app.poster.delivery.models import DeliveryStatus
from app.poster.delivery.services.publisher import TelegramPublisher
from app.poster.publications.models import Post


class EditMessagesUseCase:
    """Меняет текст поста во всех каналах, куда он ушёл. Фото и видео Telegram сменить не даёт."""

    def __init__(self, publisher: TelegramPublisher) -> None:
        self.publisher = publisher

    async def execute(self, post: Post) -> None:
        """Ошибку правки записывает в доставку, чтобы автор её увидел."""

        sent = [delivery for delivery in post.deliveries if delivery.status == DeliveryStatus.SENT]

        for delivery in sent:
            reply = await self.publisher.edit(post, delivery.channel.chat_id, delivery.message_ids[0])
            delivery.error = reply.error
