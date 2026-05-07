from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.notification import NotificationListResponse, NotificationMutationResponse
from services.notifications import (
    DeleteAllNotificationsUseCase,
    DeleteNotificationUseCase,
    ListNotificationsUseCase,
    MarkAllNotificationsReadUseCase,
    MarkNotificationReadUseCase,
    NotificationRepository,
)

router = APIRouter(prefix="/notifications", tags=["notifications"])


def build_repo(db: AsyncSession) -> NotificationRepository:
    return NotificationRepository(db)


@router.get("/", response_model=NotificationListResponse)
async def list_notifications(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    use_case = ListNotificationsUseCase(build_repo(db))
    return await use_case.execute(user_id=user_id, limit=limit, offset=offset)


@router.post("/read-all", response_model=NotificationMutationResponse)
async def mark_all_notifications_read(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    use_case = MarkAllNotificationsReadUseCase(build_repo(db))
    return await use_case.execute(user_id)


@router.post("/{notification_id}/read", response_model=NotificationMutationResponse)
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    use_case = MarkNotificationReadUseCase(build_repo(db))
    return await use_case.execute(notification_id=notification_id, user_id=user_id)


@router.delete("/", response_model=NotificationMutationResponse)
async def delete_all_notifications(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    use_case = DeleteAllNotificationsUseCase(build_repo(db))
    return await use_case.execute(user_id)


@router.delete("/{notification_id}", response_model=NotificationMutationResponse)
async def delete_notification(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    use_case = DeleteNotificationUseCase(build_repo(db))
    return await use_case.execute(notification_id=notification_id, user_id=user_id)
