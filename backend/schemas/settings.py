from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, model_validator

class SettingsData(BaseModel):
    """Модель для настроек пользователя"""
    email: Optional[EmailStr] = Field(None, description="Почта пользователя")
    phone: Optional[str] = Field(None, description="Номер телефона пользователя")
    last_name: Optional[str] = Field(None, description="Фамилия пользователя")
    first_name: Optional[str] = Field(None, description="Имя пользователя")
    approve_password: Optional[str] = Field(None, description="Подтверждение нового пароля пользователя")
    new_password: Optional[str] = Field(None, description="Новый пароль пользователя")

    @model_validator(mode="after")
    def password_length(cls, values):
        """
        Валидатор: если указан пароль, он должен быть не менее 8 символов.
        """
        password = values.get("password")
        if password and len(password) < 8:
            raise ValueError("Пароль должен быть не менее 8 символов")
        return values
    
    @model_validator(mode="after")
    def new_password_length(cls, values):
        """
        Валидатор: если указан новый пароль, он должен быть не менее 8 символов.
        """
        new_password = values.get("new_password")
        if new_password and len(new_password) < 8:
            raise ValueError("Новый пароль должен быть не менее 8 символов")
        return values
    
    @model_validator(mode="before")
    def check_passwords_validate(cls, values):
        """
        Валидатор: новый пароль должен совпадать 
        """
        new_password = values.get("new_password")
        approve_password = values.get("approve_password")
        if new_password and approve_password and new_password != approve_password:
            raise ValueError("Новый пароль должен совпадать с подтверждением")
        return values
