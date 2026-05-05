from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field, EmailStr, model_validator


class EmailPreferences(BaseModel):
    "Гранулярные флаги уведомлений на email. Дефолтно всё включено."
    email_on_response_created: bool = True
    email_on_response_updated: bool = True
    email_on_expert_rejected: bool = True
    email_on_new_order: bool = True
    email_on_order_updated: bool = True
    email_on_bidding_finished: bool = True
    email_on_chat_message: bool = True
    email_on_question_asked: bool = True
    email_on_question_answered: bool = True

    class Config:
        from_attributes = True


class UpdatePersonalDataRequest(BaseModel):
    """Обновление персональных данных пользователя"""
    last_name: Optional[str] = Field(None, description="Фамилия", max_length=100)
    first_name: Optional[str] = Field(None, description="Имя", max_length=100)
    phone: Optional[str] = Field(None, description="Номер телефона")
    email: Optional[EmailStr] = Field(None, description="Электронная почта")
    inn: Optional[str] = Field(None, description="ИНН", min_length=10, max_length=12)

    @model_validator(mode="after")
    def validate_phone_format(self):
        """Проверка формата телефона"""
        if self.phone:
            phone_digits = "".join(symbol for symbol in self.phone if symbol.isdigit())

            if len(phone_digits) < 10:
                raise ValueError("Номер телефона должен содержать минимум 10 цифр")

        if self.inn and (not self.inn.isdigit() or len(self.inn) not in {10, 12}):
            raise ValueError("ИНН должен содержать 10 или 12 цифр")
        return self


class UpdateEmailPreferencesRequest(BaseModel):
    "Частичный патч флагов уведомлений. Любое поле опционально."
    email_on_response_created: Optional[bool] = None
    email_on_response_updated: Optional[bool] = None
    email_on_expert_rejected: Optional[bool] = None
    email_on_new_order: Optional[bool] = None
    email_on_order_updated: Optional[bool] = None
    email_on_bidding_finished: Optional[bool] = None
    email_on_chat_message: Optional[bool] = None
    email_on_question_asked: Optional[bool] = None
    email_on_question_answered: Optional[bool] = None


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
    inn: Optional[str] = None
    company_data: Optional[dict[str, Any]] = None
    email: Optional[EmailStr] = None
    email_verified: bool = False
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    rating: Optional[float] = None
    review_count: int = 0
    role: str
    email_preferences: EmailPreferences

    class Config:
        from_attributes = True