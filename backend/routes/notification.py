from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.notification import NotificationListResponse, NotificationMutationResponse
from services.notification import NotificationService

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/", response_model=NotificationListResponse)
async def list_notifications(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = NotificationService(db)
    return await service.list_notifications(user_id=user_id, limit=limit, offset=offset)


@router.post("/read-all", response_model=NotificationMutationResponse)
async def mark_all_notifications_read(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = NotificationService(db)
    return await service.mark_all_read(user_id)


@router.post("/{notification_id}/read", response_model=NotificationMutationResponse)
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = NotificationService(db)
    return await service.mark_read(notification_id=notification_id, user_id=user_id)


@router.delete("/{notification_id}", response_model=NotificationMutationResponse)
async def delete_notification(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    service = NotificationService(db)
    return await service.delete_notification(notification_id=notification_id, user_id=user_id)