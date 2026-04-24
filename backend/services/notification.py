from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import delete as sa_delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from models.notification import Notification, NotificationType
from models.response import ResponseStatus
from models.user import User
from models.user import UserRole
from schemas.notification import (
    ChatMessageNotificationItemResponse,
    ChatMessageNotificationPayload,
    NotificationItemResponse,
    NotificationListResponse,
    NotificationMutationResponse,
    NotificationPayloadModel,
    ResponseStatusChangeReason,
    ResponseStatusChangedNotificationItemResponse,
    ResponseStatusChangedNotificationPayload,
    ResponseUpdateKind,
    ResponseUpdatedNotificationItemResponse,
    ResponseUpdatedNotificationPayload,
)


class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    @staticmethod
    def to_response(notification: Notification) -> NotificationItemResponse:
        if notification.type == NotificationType.RESPONSE_UPDATED:
            return ResponseUpdatedNotificationItemResponse(
                id=notification.id,
                type=NotificationType.RESPONSE_UPDATED,
                payload=ResponseUpdatedNotificationPayload.model_validate(notification.payload or {}),
                action_url=notification.action_url,
                is_read=notification.is_read,
                created_at=notification.created_at,
                read_at=notification.read_at,
            )

        if notification.type == NotificationType.RESPONSE_STATUS_CHANGED:
            return ResponseStatusChangedNotificationItemResponse(
                id=notification.id,
                type=NotificationType.RESPONSE_STATUS_CHANGED,
                payload=ResponseStatusChangedNotificationPayload.model_validate(notification.payload or {}),
                action_url=notification.action_url,
                is_read=notification.is_read,
                created_at=notification.created_at,
                read_at=notification.read_at,
            )

        if notification.type == NotificationType.CHAT_MESSAGE:
            return ChatMessageNotificationItemResponse(
                id=notification.id,
                type=NotificationType.CHAT_MESSAGE,
                payload=ChatMessageNotificationPayload.model_validate(notification.payload or {}),
                action_url=notification.action_url,
                is_read=notification.is_read,
                created_at=notification.created_at,
                read_at=notification.read_at,
            )

        raise ValueError(f"Unsupported notification type: {notification.type}")

    async def create_notification(
        self,
        user_id: int,
        notification_type: NotificationType,
        payload: NotificationPayloadModel,
        action_url: str | None = None,
    ) -> Notification:
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            payload=payload.model_dump(mode="json"),
            action_url=action_url,
        )
        self.db.add(notification)
        await self.db.flush()

        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(notification_unread_count=User.notification_unread_count + 1)
        )
        await self.db.flush()
        return notification

    async def create_response_updated_notification(
        self,
        user_id: int,
        order_title: str,
        kind: ResponseUpdateKind = ResponseUpdateKind.UPDATED,
        action_url: str | None = None,
    ) -> Notification:
        return await self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.RESPONSE_UPDATED,
            payload=ResponseUpdatedNotificationPayload(order_title=order_title, kind=kind),
            action_url=action_url,
        )

    async def create_response_status_changed_notification(
        self,
        user_id: int,
        order_title: str,
        actor_role: UserRole,
        status_from: ResponseStatus,
        status_to: ResponseStatus,
        reason: ResponseStatusChangeReason,
        action_url: str | None = None,
    ) -> Notification:
        return await self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.RESPONSE_STATUS_CHANGED,
            payload=ResponseStatusChangedNotificationPayload(
                order_title=order_title,
                actor_role=actor_role,
                status_from=status_from,
                status_to=status_to,
                reason=reason,
            ),
            action_url=action_url,
        )

    async def create_chat_message_notification(
        self,
        user_id: int,
        order_title: str,
        sender_role: UserRole,
        preview: str,
        action_url: str | None = None,
    ) -> Notification:
        return await self.create_notification(
            user_id=user_id,
            notification_type=NotificationType.CHAT_MESSAGE,
            payload=ChatMessageNotificationPayload(
                order_title=order_title,
                sender_role=sender_role,
                preview=preview,
            ),
            action_url=action_url,
        )

    async def get_unread_count(self, user_id: int) -> int:
        result = await self.db.execute(
            select(User.notification_unread_count).where(User.id == user_id)
        )
        value = result.scalar_one_or_none()
        return int(value or 0)

    async def get_notification_or_404(self, notification_id: int, user_id: int) -> Notification:
        result = await self.db.execute(
            select(Notification).where(
                Notification.id == notification_id,
                Notification.user_id == user_id,
            )
        )
        notification = result.scalars().first()
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Уведомление не найдено",
            )
        return notification

    async def list_notifications(
        self,
        user_id: int,
        limit: int = 50,
        offset: int = 0,
    ) -> NotificationListResponse:
        total_result = await self.db.execute(
            select(func.count(Notification.id)).where(Notification.user_id == user_id)
        )
        total = int(total_result.scalar_one() or 0)

        items_result = await self.db.execute(
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc(), Notification.id.desc())
            .offset(offset)
            .limit(limit)
        )
        items = list(items_result.scalars().all())

        return NotificationListResponse(
            items=[self.to_response(item) for item in items],
            total=total,
            unread_count=await self.get_unread_count(user_id),
        )

    async def mark_read(self, notification_id: int, user_id: int) -> NotificationMutationResponse:
        now = datetime.now(timezone.utc)

        result = await self.db.execute(
            update(Notification)
            .where(
                Notification.id == notification_id,
                Notification.user_id == user_id,
                Notification.is_read == False,  # noqa: E712
            )
            .values(is_read=True, read_at=now)
            .returning(Notification.id)
        )
        updated = 1 if result.scalar_one_or_none() is not None else 0

        if updated:
            await self.db.execute(
                update(User)
                .where(User.id == user_id)
                .values(notification_unread_count=func.greatest(User.notification_unread_count - 1, 0))
            )

        await self.db.flush()

        notification = await self.get_notification_or_404(notification_id, user_id)
        await self.db.refresh(notification)

        return NotificationMutationResponse(
            unread_count=await self.get_unread_count(user_id),
            updated=updated,
            item=self.to_response(notification),
        )

    async def mark_all_read(self, user_id: int) -> NotificationMutationResponse:
        now = datetime.now(timezone.utc)
        result = await self.db.execute(
            update(Notification)
            .where(
                Notification.user_id == user_id,
                Notification.is_read == False,  # noqa: E712
            )
            .values(is_read=True, read_at=now)
        )
        updated = int(result.rowcount or 0)

        if updated:
            await self.db.execute(
                update(User)
                .where(User.id == user_id)
                .values(notification_unread_count=func.greatest(User.notification_unread_count - updated, 0))
            )
            await self.db.flush()

        return NotificationMutationResponse(
            unread_count=await self.get_unread_count(user_id),
            updated=updated,
        )

    async def delete_notification(self, notification_id: int, user_id: int) -> NotificationMutationResponse:
        result = await self.db.execute(
            sa_delete(Notification)
            .where(
                Notification.id == notification_id,
                Notification.user_id == user_id,
            )
            .returning(Notification.is_read)
        )
        row = result.first()
        if row is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Уведомление не найдено",
            )

        if not row[0]:
            await self.db.execute(
                update(User)
                .where(User.id == user_id)
                .values(notification_unread_count=func.greatest(User.notification_unread_count - 1, 0))
            )

        await self.db.flush()

        return NotificationMutationResponse(
            unread_count=await self.get_unread_count(user_id),
            updated=1,
        )