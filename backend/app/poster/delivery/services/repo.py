"""Очередь доставок постов в Telegram."""

from datetime import datetime

from sqlalchemy import or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.delivery.models import DeliveryStatus, PostDelivery
from app.poster.publications.models import Post, PostStatus


class DeliveryRepository:
    """Доступ к таблице post_deliveries. Несколько процессов не берут одну доставку дважды."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def claim(self, now: datetime, limit: int) -> list[int]:
        """Забирает порцию ждущих доставок опубликованных постов и помечает их отправляемыми."""

        due = (
            select(PostDelivery.id)
            .join(Post, Post.id == PostDelivery.post_id)
            .where(
                PostDelivery.status == DeliveryStatus.PENDING,
                Post.status == PostStatus.PUBLISHED,
                or_(PostDelivery.next_attempt_at.is_(None), PostDelivery.next_attempt_at <= now),
            )
            .order_by(PostDelivery.id)
            .limit(limit)
            .with_for_update(of=PostDelivery, skip_locked=True)
        )
        stmt = (
            update(PostDelivery)
            .where(PostDelivery.id.in_(due))
            .values(status=DeliveryStatus.SENDING, attempts=PostDelivery.attempts + 1)
            .returning(PostDelivery.id)
        )
        ids = await self.db.scalars(stmt)

        return list(ids)

    async def release_stuck(self, before: datetime) -> None:
        """Доставки, зависшие в отправке после падения процесса, снова ждут очереди."""

        stmt = (
            update(PostDelivery)
            .where(PostDelivery.status == DeliveryStatus.SENDING, PostDelivery.updated_at < before)
            .values(status=DeliveryStatus.PENDING)
        )

        await self.db.execute(stmt)

    async def list_expired(self, now: datetime, limit: int) -> list[PostDelivery]:
        """Отправленные доставки, которым пора исчезнуть из канала. Занятые другим процессом — пропускаются."""

        stmt = (
            select(PostDelivery)
            .where(PostDelivery.status == DeliveryStatus.SENT, PostDelivery.delete_at <= now)
            .order_by(PostDelivery.delete_at)
            .limit(limit)
            .with_for_update(of=PostDelivery, skip_locked=True)
        )
        deliveries = await self.db.scalars(stmt)

        return list(deliveries)

    async def get(self, delivery_id: int) -> PostDelivery | None:
        """Доставка вместе с каналом или None."""

        return await self.db.get(PostDelivery, delivery_id)

    async def save(self) -> None:
        """Записывает изменения доставок."""

        await self.db.flush()
