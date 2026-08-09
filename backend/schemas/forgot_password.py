
from pydantic import BaseModel, EmailStr, Field, field_validator

from schemas.registration import validate_password_complexity


class SendResetCodeRequest(BaseModel):
    "Модель для запроса отправки кода сброса пароля"
    email: EmailStr | None = Field(None, description="Почта пользователя")
    phone: str | None = Field(None, description="Номер телефона пользователя")


class VerifyCodeRequest(BaseModel):
    "Проверка кода без смены пароля (для перехода на шаг ввода нового пароля)"
    email: EmailStr | None = Field(None, description="Почта пользователя")
    phone: str | None = Field(None, description="Номер телефона пользователя")
    code: str = Field(..., description="Код восстановления")


class ForgotPasswordRequest(BaseModel):
    "модель валидации для запроса на восстановление пароля"
    email: EmailStr | None = Field(None, description="Почта пользователя")
    phone: str | None = Field(None, description="Номер телефона пользователя")
    code: str = Field(..., description="Код для восстановления пароля")
    new_password: str = Field(..., description="Новый пароль пользователя", min_length=6)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        return validate_password_complexity(value)


class ForgotPasswordResponse(BaseModel):
    "модель для ответа на фронтенд"
    message: str

    class Config:
        from_attributes = True
