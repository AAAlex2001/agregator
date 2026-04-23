from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field, EmailStr
from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"


class UserRegistration(BaseModel):
    "модель валидации пользователя"
    role: UserRole = Field(..., description="Роль пользователя")
    email: EmailStr = Field(..., description="Почта пользователя")
    password: str = Field(..., description="Пароль пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    inn: Optional[str] = Field(None, description="ИНН")
    company_data: dict[str, Any] | None = Field(None, description="Полные данные компании из DaData")
    first_name: Optional[str] = Field(None, description="Имя", max_length=100)
    last_name: Optional[str] = Field(None, description="Фамилия", max_length=100)


class EmailConfirmRequest(BaseModel):
    email: EmailStr = Field(..., description="Почта пользователя")
    code: str = Field(..., description="Код подтверждения")


class EmailConfirmResponse(BaseModel):
    message: str


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
