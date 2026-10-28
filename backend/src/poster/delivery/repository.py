from datetime import datetime

from sqlalchemy import delete, or_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.delivery.models import DeliveryStatus, PostDelivery
from src.poster.posts.models import Post, PostStatus


class DeliveryRepository:
    """Читает и записывает доставки постов в Telegram-каналы."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def get(self, delivery_id: int) -> PostDelivery | None:
        """Возвращает доставку вместе с постом, его фото и видео и каналом."""
        query = select(PostDelivery).where(PostDelivery.id == delivery_id)
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def list_ready_ids(self, now: datetime) -> list[int]:
        """Возвращает id доставок, которые пора отправить."""
        query = (
            select(PostDelivery.id)
            .join(Post, Post.id == PostDelivery.post_id)
            .where(
                PostDelivery.status == DeliveryStatus.PENDING,
                Post.status == PostStatus.PUBLISHED,
                or_(PostDelivery.next_attempt_at.is_(None), PostDelivery.next_attempt_at <= now),
            )
            .order_by(PostDelivery.id)
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def list_expired(self, now: datetime) -> list[PostDelivery]:
        """Возвращает отправленные посты, которые пора удалить из канала по таймеру автора."""
        query = select(PostDelivery).where(
            PostDelivery.status == DeliveryStatus.SENT,
            PostDelivery.delete_at <= now,
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def list_sent(self, post_id: int) -> list[PostDelivery]:
        """Возвращает каналы, в которые пост уже отправлен."""
        query = select(PostDelivery).where(
            PostDelivery.post_id == post_id,
            PostDelivery.status == DeliveryStatus.SENT,
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def find_sent_message_id(self, post_id: int, channel_id: int) -> int | None:
        """Возвращает id первого сообщения поста в канале или None, если пост туда не уходил."""
        query = select(PostDelivery).where(
            PostDelivery.post_id == post_id,
            PostDelivery.channel_id == channel_id,
            PostDelivery.status == DeliveryStatus.SENT,
        )
        result = await self.db.execute(query)
        delivery = result.scalar_one_or_none()

        if delivery is None or not delivery.message_ids:
            return None

        return delivery.message_ids[0]

    async def add_missing(self, post_id: int, channel_ids: list[int]) -> None:
        """Ставит пост в очередь в новые каналы, а неудачные отправки — заново. Остальное не трогает."""
        if not channel_ids:
            return

        query = (
            insert(PostDelivery)
            .values([{"post_id": post_id, "channel_id": channel_id} for channel_id in channel_ids])
            .on_conflict_do_update(
                index_elements=["post_id", "channel_id"],
                set_={
                    "status": DeliveryStatus.PENDING,
                    "attempts": 0,
                    "error": None,
                    "next_attempt_at": None,
                },
                where=PostDelivery.status == DeliveryStatus.FAILED,
            )
        )
        await self.db.execute(query)

    async def delete_pending_except(self, post_id: int, channel_ids: list[int]) -> None:
        """Убирает из очереди каналы, с которых автор снял галочку. Отправленное не трогает."""
        query = delete(PostDelivery).where(
            PostDelivery.post_id == post_id,
            PostDelivery.status == DeliveryStatus.PENDING,
            PostDelivery.channel_id.not_in(channel_ids),
        )
        await self.db.execute(query)

    async def save(self) -> None:
        """Сохраняет изменения доставок в базе."""
        await self.db.flush()
