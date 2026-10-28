from datetime import UTC, datetime, timedelta

from src.core.telegram import TelegramError
from src.poster.channels.repository import ChannelRepository
from src.poster.delivery.models import DeliveryStatus
from src.poster.delivery.publisher import TelegramPublisher
from src.poster.delivery.repository import DeliveryRepository
from src.poster.delivery.schemas import TelegramOptions

MAX_ATTEMPTS = 3
RETRY_SECONDS = 60


class SendPostUseCase:
    """Отправка поста в один канал. Её запускает worker для каждой готовой доставки."""

    def __init__(
        self,
        deliveries: DeliveryRepository,
        channels: ChannelRepository,
        publisher: TelegramPublisher,
    ) -> None:
        """Принимает доставки, каналы и отправителя в Telegram."""
        self.deliveries = deliveries
        self.channels = channels
        self.publisher = publisher

    async def execute(self, *, delivery_id: int) -> None:
        """Отправляет пост в канал. При ошибке пробует ещё два раза, потом сдаётся."""
        delivery = await self.deliveries.get(delivery_id)

        if delivery is None or delivery.status != DeliveryStatus.PENDING:
            return

        post = delivery.post
        channel = delivery.channel
        now = datetime.now(UTC)
        reply_to_message_id = None

        if post.reply_to_id is not None:
            reply_to_message_id = await self.deliveries.find_sent_message_id(post.reply_to_id, channel.id)

        try:
            message_ids = await self.publisher.send(post, channel.chat_id, reply_to_message_id)
        except TelegramError as error:
            if error.new_chat_id is not None:
                await self.channels.move_chat(channel.chat_id, error.new_chat_id)
                return

            delivery.attempts += 1
            delivery.error = error.description
            delivery.next_attempt_at = now + timedelta(seconds=error.retry_after or RETRY_SECONDS)

            if delivery.attempts >= MAX_ATTEMPTS:
                delivery.status = DeliveryStatus.FAILED

            await self.deliveries.save()
            return

        options = TelegramOptions.model_validate(post.telegram)

        delivery.status = DeliveryStatus.SENT
        delivery.message_ids = message_ids
        delivery.sent_at = now
        delivery.error = None

        if options.auto_delete_hours is not None:
            delivery.delete_at = now + timedelta(hours=options.auto_delete_hours)

        await self.deliveries.save()
