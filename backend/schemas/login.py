from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, model_validator


class UserLogin(BaseModel):
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    inn: Optional[str] = Field(None, description="ИНН пользователя")
    password: str = Field(..., description="Пароль пользователя")

    @model_validator(mode="after")
    def phone_or_email_required(self):
        if not self.phone and not self.email and not self.inn:
            raise ValueError("Необходимо указать email, телефон или ИНН")
        if self.inn and (not self.inn.isdigit() or len(self.inn) not in {10, 12}):
            raise ValueError("ИНН должен содержать 10 или 12 цифр")
        return self


class UserResponse(BaseModel):
    id: int
    role: str
    inn: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
