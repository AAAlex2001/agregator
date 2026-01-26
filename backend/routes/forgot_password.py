from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.forgot_password import SendResetCodeRequest, ForgotPasswordRequest, ForgotPasswordResponse
from services.forgot_password import ForgotPasswordService

router = APIRouter(prefix="/forgot-password", tags=["auth"])


@router.post("/send-code", response_model=ForgotPasswordResponse)
async def send_reset_code(
    data: SendResetCodeRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Отправка кода для сброса пароля на email или телефон
    """
    service = ForgotPasswordService(db)
    
    # Находим пользователя
    user = await service.validate_user_exists(data.email, data.phone)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )
    
    # Генерируем код
    code = await service.create_reset_code(user.id)
    
    # TODO: Отправить код на email или телефон
    # В реальном проекте здесь должна быть отправка кода через email/SMS
    # Для разработки просто возвращаем сообщение
    
    return ForgotPasswordResponse(
        message=f"Код сброса пароля отправлен. Код для разработки: {code}"
    )


@router.post("/reset-password", response_model=ForgotPasswordResponse)
async def reset_password(
    data: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Сброс пароля по коду
    """
    service = ForgotPasswordService(db)
    
    # Находим пользователя
    user = await service.validate_user_exists(data.email, data.phone)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден",
        )
    
    # Сбрасываем пароль
    await service.reset_password(user.id, data.code, data.new_password)
    
    return ForgotPasswordResponse(
        message="Пароль успешно изменен"
    )
