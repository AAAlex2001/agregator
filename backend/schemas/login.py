from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr

from models.user import UserRole


class UserLogin(BaseModel):
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    inn: Optional[str] = Field(None, description="ИНН пользователя")
    password: str = Field(..., description="Пароль пользователя")
    role: Optional[UserRole] = Field(
        None,
        description="Если на одни данные зарегистрировано несколько ролей — указать какую использовать",
    )


class UserResponse(BaseModel):
    id: int
    role: str
    inn: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class RoleChoiceResponse(BaseModel):
    "Возвращается когда пользователь имеет несколько подходящих ролей и нужно выбрать."
    detail: str = "Выберите роль для входа"
    available_roles: list[UserRole]
