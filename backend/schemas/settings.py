from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, model_validator


class UpdatePersonalDataRequest(BaseModel):
    """Обновление персональных данных пользователя"""
    last_name: Optional[str] = Field(None, description="Фамилия", max_length=100)
    first_name: Optional[str] = Field(None, description="Имя", max_length=100)
    phone: Optional[str] = Field(None, description="Номер телефона")
    email: Optional[EmailStr] = Field(None, description="Электронная почта")

    @model_validator(mode="after")
    def validate_phone_format(self):
        """Проверка формата телефона"""
        if self.phone and (not self.phone.isdigit() or len(self.phone) < 10):
            raise ValueError("Номер телефона должен содержать минимум 10 цифр")
        return self


class ChangePasswordRequest(BaseModel):
    """Смена пароля пользователя"""
    new_password: str = Field(..., description="Новый пароль", min_length=8)
    new_password_confirm: str = Field(..., description="Подтверждение нового пароля")

    @model_validator(mode="after")
    def check_passwords_match(self):
        """Проверка совпадения паролей"""
        if self.new_password != self.new_password_confirm:
            raise ValueError("Пароли не совпадают")
        return self


class UserSettingsResponse(BaseModel):
    id: int
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    balance: int = 0
    rating: Optional[float] = None
    review_count: int = 0
    role: str

    class Config:
        from_attributes = True


class FinanceOperationType(str):
    DEPOSIT = "deposit"
    COMMISSION = "commission"
    REFUND = "refund"
    PARTICIPATION_FEE = "participation_fee"


class FinanceOperationResponse(BaseModel):
    """История финансовых операций"""
    id: int
    date: datetime
    operation_type: str = Field(..., description="Тип операции")
    amount: float = Field(..., description="Сумма операции")
    description: str = Field(..., description="Описание операции")

    class Config:
        from_attributes = True


class BalanceResponse(BaseModel):
    """Баланс пользователя"""
    balance: float = Field(..., description="Текущий баланс")
    currency: str = Field(default="RUB", description="Валюта")

    class Config:
        from_attributes = True