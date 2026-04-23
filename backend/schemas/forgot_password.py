from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class SendResetCodeRequest(BaseModel):
    "Модель для запроса отправки кода сброса пароля"
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")


class VerifyCodeRequest(BaseModel):
    "Проверка кода без смены пароля (для перехода на шаг ввода нового пароля)"
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    code: str = Field(..., description="Код восстановления")


class ForgotPasswordRequest(BaseModel):
    "модель валидации для запроса на восстановление пароля"
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    code: str = Field(..., description="Код для восстановления пароля")
    new_password: str = Field(..., description="Новый пароль пользователя")


class ForgotPasswordResponse(BaseModel):
    "модель для ответа на фронтенд"
    message: str

    class Config:
        from_attributes = True
