"""Отправка поста в один канал из очереди."""

from datetime import UTC, datetime, timedelta

from app.core.telegram import TelegramReply
from app.poster.channels.services.repo import ChannelRepository
from app.poster.delivery.models import MAX_ATTEMPTS, DeliveryStatus, PostDelivery
from app.poster.delivery.options import TelegramOptions
from app.poster.delivery.services.publisher import TelegramPublisher
from app.poster.delivery.services.repo import DeliveryRepository
from app.poster.publications.models import Post
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

        reply_to = await self.reply_message_id(post, delivery.channel_id)
        reply = await self.publisher.send(post, delivery.channel.chat_id, reply_to)

        if reply.migrate_to_chat_id is not None:
            await self.channels.move_chat(delivery.channel.chat_id, reply.migrate_to_chat_id)
            reply = await self.publisher.send(post, reply.migrate_to_chat_id, reply_to)

        options = TelegramOptions.of(post.telegram)
        record_outcome(delivery, reply, datetime.now(UTC), options.auto_delete_hours)
        await self.deliveries.save()


    async def reply_message_id(self, post: Post, channel_id: int) -> int | None:
        """Сообщение исходного поста в этом канале, если пост — ответ и исходный здесь вышел."""

        if post.reply_to_id is None:
            return None

        original = await self.posts.get_by_id(post.reply_to_id)
        if original is None:
            return None

        sent = [
            delivery.message_ids[0]
            for delivery in original.deliveries
            if delivery.channel_id == channel_id and delivery.status == DeliveryStatus.SENT
        ]

        return sent[0] if sent else None


def record_outcome(
    delivery: PostDelivery,
    reply: TelegramReply,
    now: datetime,
    auto_delete_hours: int | None = None,
) -> None:
    """Успех — отправлено, с автоудалением ставится срок. 429 — ждём сколько сказал Telegram.

    Иначе повтор или отказ.
    """

    if reply.ok:
        delivery.status = DeliveryStatus.SENT
        delivery.message_ids = reply.result
        delivery.sent_at = now
        delivery.error = None
        delivery.delete_at = now + timedelta(hours=auto_delete_hours) if auto_delete_hours else None
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
