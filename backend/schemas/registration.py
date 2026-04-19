from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field, EmailStr, model_validator
from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"


class UserRegistration(BaseModel):
    "модель валидации пользователя"
    role: UserRole = Field(..., description="Роль пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    inn: str = Field(..., description="ИНН", min_length=10, max_length=12)
    company_data: dict[str, Any] | None = Field(None, description="Полные данные компании из DaData")
    password: str = Field(..., description="Пароль пользователя")
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    first_name: Optional[str] = Field(None, description="Имя", max_length=100)
    last_name: Optional[str] = Field(None, description="Фамилия", max_length=100)

    @model_validator(mode="after")
    def phone_or_email_required(self):
        """
        Валидатор: должен быть указан либо phone, либо email.
        """
        if not self.phone and not self.email:
            raise ValueError("Необходимо указать либо телефон, либо email")
        if not self.inn.isdigit() or len(self.inn) not in {10, 12}:
            raise ValueError("ИНН должен содержать 10 или 12 цифр")
        return self


class PartySuggestionRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=200)
    count: int = Field(default=10, ge=1, le=10)


class PartySuggestionResponse(BaseModel):
    value: str
    unrestricted_value: str
    data: dict[str, Any] = Field(default_factory=dict)
    


class UserResponse(BaseModel):
    "модель для ответа на фронтенд"
    id: int
    role: UserRole
    inn: str | None = None
    company_data: dict[str, Any] | None = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
