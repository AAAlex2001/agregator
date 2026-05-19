from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.user import User, UserRole
from schemas.license_holder import LicenseHolderListItem, LicenseHolderListResponse
from services.license_holders import LicenseHoldersRepository, ListLicenseHoldersUseCase

router = APIRouter(prefix="/license-holders", tags=["license-holders"])


async def require_expert(db: AsyncSession, user_id: int) -> None:
    "Каталог лицензиатов доступен только эксперту. 403 для остальных ролей."
    role = (
        await db.execute(select(User.role).where(User.id == user_id))
    ).scalar_one_or_none()
    if role != UserRole.EXPERT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Каталог лицензиатов доступен только эксперту",
        )


def build_repo(db: AsyncSession) -> LicenseHoldersRepository:
    return LicenseHoldersRepository(db)


@router.get("/", response_model=LicenseHolderListResponse)
async def list_license_holders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LicenseHolderListResponse:
    "Список активных лицензиатов. Только для роли EXPERT."
    await require_expert(db, user_id)
    use_case = ListLicenseHoldersUseCase(build_repo(db))
    items, total = await use_case.execute(skip, limit)
    return LicenseHolderListResponse(
        items=[LicenseHolderListItem.model_validate(user) for user in items],
        total=total,
    )
