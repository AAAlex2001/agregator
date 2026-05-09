from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.user import User, UserRole
from schemas.license_holder import LicenseHolderListItem, LicenseHolderListResponse
from services.license_holders import LicenseHolderRepository
from sqlalchemy import select


router = APIRouter(prefix="/license-holders", tags=["license-holders"])


async def require_expert(db: AsyncSession, user_id: int) -> None:
    role = (
        await db.execute(select(User.role).where(User.id == user_id))
    ).scalar_one_or_none()
    if role != UserRole.EXPERT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Каталог лицензиатов доступен только эксперту",
        )


@router.get("/", response_model=LicenseHolderListResponse)
async def list_license_holders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    await require_expert(db, user_id)
    repo = LicenseHolderRepository(db)
    items, total = await repo.list_active(skip, limit)
    return LicenseHolderListResponse(
        items=[LicenseHolderListItem.model_validate(u) for u in items],
        total=total,
    )
