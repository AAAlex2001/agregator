from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext

from database.database import get_db
from dependencies.auth import get_current_user
from models.user import User
from schemas.settings import (
    ChangePasswordRequest,
    UpdatePersonalDataRequest,
    UserSettingsResponse,
)

router = APIRouter(tags=["settings"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/settings/profile", response_model=UserSettingsResponse)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )
    return UserSettingsResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        first_name=user.first_name,
        last_name=user.last_name,
        balance=user.balance or 0,
        rating=float(user.rating) if user.rating is not None else None,
        review_count=user.review_count or 0,
        role=user.role.value,
    )


@router.put("/settings/profile", response_model=UserSettingsResponse)
async def update_profile(
    data: UpdatePersonalDataRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )

    if data.first_name is not None:
        user.first_name = data.first_name
    if data.last_name is not None:
        user.last_name = data.last_name
    if data.phone is not None:
        existing = await db.execute(
            select(User).where(User.phone == data.phone, User.role == user.role, User.id != user_id)
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот номер телефона уже используется",
            )
        user.phone = data.phone
    if data.email is not None:
        existing = await db.execute(
            select(User).where(User.email == data.email, User.role == user.role, User.id != user_id)
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот email уже используется",
            )
        user.email = data.email

    await db.commit()
    await db.refresh(user)

    return UserSettingsResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        first_name=user.first_name,
        last_name=user.last_name,
        balance=user.balance or 0,
        rating=float(user.rating) if user.rating is not None else None,
        review_count=user.review_count or 0,
        role=user.role.value,
    )


@router.post("/settings/password")
async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )

    user.password = pwd_context.hash(data.new_password)
    await db.commit()

    return {"detail": "Пароль успешно изменён"}
