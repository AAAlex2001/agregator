from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field, EmailStr, model_validator
from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"
    LICENSE_HOLDER = "LICENSE_HOLDER"


class LicenseRentalKind(str, Enum):
    PERCENT = "PERCENT"
    FIXED = "FIXED"
    NEGOTIABLE = "NEGOTIABLE"


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


class LicenseHolderRegistration(BaseModel):
    "Регистрация держателя лицензии. Файл лицензии передаётся отдельным multipart-полем."
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str = Field(..., min_length=10)
    inn: str = Field(..., min_length=10, max_length=12, pattern=r"^\d{10}(\d{2})?$")
    company_data: dict[str, Any]
    license_number: str = Field(..., min_length=1, max_length=100)
    license_areas: list[str] = Field(..., min_length=1)
    license_rental_kind: LicenseRentalKind
    license_rental_percent: Optional[float] = Field(None, gt=0, le=100)
    license_rental_fixed_amount: Optional[int] = Field(None, gt=0)

    @model_validator(mode="after")
    def cross_field_checks(self) -> "LicenseHolderRegistration":
        company_inn = (self.company_data.get("data") or {}).get("inn")
        if company_inn and company_inn != self.inn:
            raise ValueError("Выбранная компания не соответствует указанному ИНН")
        if self.license_rental_kind is LicenseRentalKind.PERCENT and self.license_rental_percent is None:
            raise ValueError("Укажите процент от суммы договора")
        if self.license_rental_kind is LicenseRentalKind.FIXED and self.license_rental_fixed_amount is None:
            raise ValueError("Укажите минимальную фиксированную цену предоставления лицензии")
        return self


class EmailConfirmRequest(BaseModel):
    email: EmailStr = Field(..., description="Почта пользователя")
    code: str = Field(..., description="Код подтверждения")
    role: Optional[UserRole] = Field(None, description="Если на email несколько ролей — какую подтверждаем")


class ResendCodeRequest(BaseModel):
    email: EmailStr = Field(..., description="Почта пользователя")
    role: Optional[UserRole] = Field(None, description="Если на email несколько ролей — какую переотправить")


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
    license_number: Optional[str] = None
    license_file_url: Optional[str] = None
    license_areas: Optional[list[str]] = None
    license_rental_kind: Optional[LicenseRentalKind] = None
    license_rental_percent: Optional[float] = None
    license_rental_fixed_amount: Optional[int] = None

    class Config:
        from_attributes = True
