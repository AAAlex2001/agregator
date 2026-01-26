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
    
    @model_validator(mode="before")
    def new_password_length(cls, values):
        """
        Валидатор: новый пароль должен быть не менее 8 символов.
        """
        new_password = values.get("new_password")
        if new_password and len(new_password) < 8:
            raise ValueError("Новый пароль должен быть не менее 8 символов")
        return values
    
    @model_validator(mode="before")
    def code_length(cls, values):
        """
        Валидатор: код должен быть не менее 6 символов.
        """
        code = values.get("code")
        if code and len(code) < 6:
            raise ValueError("Код должен быть не менее 6 символов")
        return values
    
    @model_validator(mode="before")
    def new_password_check(cls, values):
        """
        Валидатор: новый пароль должен совпадать с подтверждением.
        """
        new_password = values.get("new_password")
        new_password_confirm = values.get("new_password_confirm")
        if new_password != new_password_confirm:
            raise ValueError("Новый пароль и его подтверждение не совпадают")
        return values
    
class ForgotPasswordResponse(BaseModel):
    "модель для ответа на фронтенд"
    message: str

    class Config:
        from_attributes = True    