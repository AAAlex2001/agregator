from typing import Optional
from pydantic import BaseModel, Field, EmailStr, model_validator


class SendResetCodeRequest(BaseModel):
    """Модель для запроса отправки кода сброса пароля"""
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")

    @model_validator(mode="after")
    def phone_or_email_required(self):
        """
        Валидатор: должен быть указан либо phone, либо email.
        """
        if not self.phone and not self.email:
            raise ValueError("Необходимо указать либо телефон, либо email")
        return self


class ForgotPasswordRequest(BaseModel):
    "модель валидации для запроса на восстановление пароля"
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    code: str = Field(..., description="Код для восстановления пароля")
    new_password: str = Field(..., description="Новый пароль пользователя")
    new_password_confirm: str = Field(..., description="Подтверждение нового пароля")

    @model_validator(mode="after")
    def phone_or_email_required(self):
        """
        Валидатор: должен быть указан либо phone, либо email.
        """
        if not self.phone and not self.email:
            raise ValueError("Необходимо указать либо телефон, либо email")
        return self
    
    
class ForgotPasswordResponse(BaseModel):
    "модель для ответа на фронтенд"
    message: str

    class Config:
        from_attributes = True    