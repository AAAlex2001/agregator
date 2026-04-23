from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class UserLogin(BaseModel):
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    inn: Optional[str] = Field(None, description="ИНН пользователя")
    password: str = Field(..., description="Пароль пользователя")


class UserResponse(BaseModel):
    id: int
    role: str
    inn: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
