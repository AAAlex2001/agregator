from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.rate_limit import rate_limit
from schemas.forgot_password import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    SendResetCodeRequest,
    VerifyCodeRequest,
)
from services.forgot_password import (
    ForgotPasswordRepository,
    ForgotPasswordValidator,
    ResetPasswordUseCase,
    SendResetCodeUseCase,
    VerifyResetCodeUseCase,
)
from services.verification import VerificationService

router = APIRouter(prefix="/forgot-password", tags=["auth"])


def build_repo(db: AsyncSession) -> ForgotPasswordRepository:
    return ForgotPasswordRepository(db)


def build_validator(repo: ForgotPasswordRepository) -> ForgotPasswordValidator:
    return ForgotPasswordValidator(repo)


@router.post(
    "/send-code",
    response_model=ForgotPasswordResponse,
    dependencies=[Depends(rate_limit("forgot_send", max_calls=2, window_seconds=60))],
)
async def send_reset_code(
    data: SendResetCodeRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> ForgotPasswordResponse:
    "Отправляет код восстановления пароля на email или телефон; ограничено rate-limiter."
    repo = build_repo(db)
    use_case = SendResetCodeUseCase(build_validator(repo), VerificationService(db))
    await use_case.execute(data.email, data.phone, background_tasks)
    return ForgotPasswordResponse(message="Код отправлен на указанный адрес")


@router.post(
    "/verify-code",
    response_model=ForgotPasswordResponse,
    dependencies=[Depends(rate_limit("forgot_verify", max_calls=5, window_seconds=60))],
)
async def verify_reset_code(
    data: VerifyCodeRequest,
    db: AsyncSession = Depends(get_db),
) -> ForgotPasswordResponse:
    "Проверяет ранее отправленный код восстановления пароля."
    repo = build_repo(db)
    use_case = VerifyResetCodeUseCase(build_validator(repo), VerificationService(db))
    await use_case.execute(data.email, data.phone, data.code)
    return ForgotPasswordResponse(message="Код подтверждён")


@router.post(
    "/reset-password",
    response_model=ForgotPasswordResponse,
    dependencies=[Depends(rate_limit("forgot_reset", max_calls=5, window_seconds=60))],
)
async def reset_password(
    data: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
) -> ForgotPasswordResponse:
    "Сбрасывает пароль пользователя по подтверждённому коду восстановления."
    repo = build_repo(db)
    use_case = ResetPasswordUseCase(repo, build_validator(repo), VerificationService(db))
    await use_case.execute(data.email, data.phone, data.code, data.new_password)
    return ForgotPasswordResponse(message="Пароль успешно изменен")
