from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.forgot_password import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    SendResetCodeRequest,
    VerifyCodeRequest,
)
from services.forgot_password import ForgotPasswordService

router = APIRouter(prefix="/forgot-password", tags=["auth"])


@router.post("/send-code", response_model=ForgotPasswordResponse)
async def send_reset_code(
    data: SendResetCodeRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    service = ForgotPasswordService(db)
    await service.schedule_reset_code(data.email, data.phone, background_tasks)
    return ForgotPasswordResponse(message="Код отправлен на указанный адрес")


@router.post("/verify-code", response_model=ForgotPasswordResponse)
async def verify_reset_code(
    data: VerifyCodeRequest,
    db: AsyncSession = Depends(get_db),
):
    service = ForgotPasswordService(db)
    await service.verify_code(data.email, data.phone, data.code)
    return ForgotPasswordResponse(message="Код подтверждён")


@router.post("/reset-password", response_model=ForgotPasswordResponse)
async def reset_password(
    data: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    service = ForgotPasswordService(db)
    await service.reset_password(data.email, data.phone, data.code, data.new_password)
    return ForgotPasswordResponse(message="Пароль успешно изменен")
