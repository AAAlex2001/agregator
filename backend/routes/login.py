from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from schemas.login import UserLogin, UserResponse
from services.login import LoginService

router = APIRouter(prefix="/login", tags=["auth"])

@router.post("/", response_model=UserResponse)
async def login_user(
    data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    service = LoginService(db)
    user = None
    if data.email:
        user = await service.get_user_by_email(data.email)
    elif data.phone:
        user = await service.get_user_by_phone(data.phone)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )
    
    if not service.verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный пароль",
        )

    return user