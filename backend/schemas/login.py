from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, model_validator


class UserLogin(BaseModel):
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    password: str = Field(..., description="Пароль пользователя")
    role: str = Field(..., description="Роль: CUSTOMER или EXPERT")

    @model_validator(mode="after")
    def phone_or_email_required(self):
        if not self.phone and not self.email:
            raise ValueError("Необходимо указать либо телефон, либо email")
        return self


class UserResponse(BaseModel):
    id: int
    role: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
