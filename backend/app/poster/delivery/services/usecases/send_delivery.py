"""Отправка поста в один канал из очереди."""

from datetime import UTC, datetime, timedelta

from app.core.telegram import TelegramReply
from app.poster.channels.services.repo import ChannelRepository
from app.poster.delivery.models import MAX_ATTEMPTS, DeliveryStatus, PostDelivery
from app.poster.delivery.services.publisher import TelegramPublisher
from app.poster.delivery.services.repo import DeliveryRepository
from app.poster.publications.services.repo import PostRepository

RETRY_DELAY = timedelta(seconds=30)


class SendDeliveryUseCase:
    """Шлёт пост и записывает итог. Неудачу повторяет позже, до трёх попыток."""

    def __init__(
        self,
        deliveries: DeliveryRepository,
        posts: PostRepository,
        channels: ChannelRepository,
        publisher: TelegramPublisher,
    ) -> None:
        self.deliveries = deliveries
        self.posts = posts
        self.channels = channels
        self.publisher = publisher

    async def execute(self, delivery_id: int) -> None:
        """Доставку уже отправил или отменил другой процесс — ничего не делает."""

        delivery = await self.deliveries.get(delivery_id)
        if delivery is None or delivery.status != DeliveryStatus.SENDING:
            return

        post = await self.posts.get_by_id(delivery.post_id)
        if post is None:
            return

        reply = await self.publisher.send(post, delivery.channel.chat_id)

        if reply.migrate_to_chat_id is not None:
            await self.channels.move_chat(delivery.channel.chat_id, reply.migrate_to_chat_id)
            reply = await self.publisher.send(post, reply.migrate_to_chat_id)

        record_outcome(delivery, reply, datetime.now(UTC))
        await self.deliveries.save()


def record_outcome(delivery: PostDelivery, reply: TelegramReply, now: datetime) -> None:
    """Успех — отправлено. 429 — ждём сколько сказал Telegram. Иначе повтор или отказ."""

    if reply.ok:
        delivery.status = DeliveryStatus.SENT
        delivery.message_ids = reply.result
        delivery.sent_at = now
        delivery.error = None
        return

    delivery.error = reply.error

    if reply.retry_after is not None:
        delivery.status = DeliveryStatus.PENDING
        delivery.attempts -= 1
        delivery.next_attempt_at = now + timedelta(seconds=reply.retry_after)
        return

    if delivery.attempts < MAX_ATTEMPTS:
        delivery.status = DeliveryStatus.PENDING
        delivery.next_attempt_at = now + RETRY_DELAY * delivery.attempts
        return

    delivery.status = DeliveryStatus.FAILED
