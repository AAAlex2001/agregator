from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, model_validator
from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"


class UserRegistration(BaseModel):
    "модель валидации пользователя"
    role: UserRole = Field(..., description="Роль пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    password: str = Field(..., description="Пароль пользователя")
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")

    @model_validator(mode="after")
    def phone_or_email_required(self):
        """
        Валидатор: должен быть указан либо phone, либо email.
        """
        if not self.phone and not self.email:
            raise ValueError("Необходимо указать либо телефон, либо email")
        return self


class UserResponse(BaseModel):
    "модель для ответа на фронтенд"
    id: int
    role: UserRole
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
