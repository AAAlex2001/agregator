from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from schemas.company import validate_company_data
from schemas.expert import ExpertCertificate


class UserRole(str, Enum):
    "Роль пользователя в системе."
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"
    LICENSE_HOLDER = "LICENSE_HOLDER"


class LicenseRentalKind(str, Enum):
    "Способ расчёта стоимости предоставления лицензии."
    PERCENT = "PERCENT"
    FIXED = "FIXED"
    NEGOTIABLE = "NEGOTIABLE"


class UserRegistration(BaseModel):
    "модель валидации пользователя"
    role: UserRole = Field(..., description="Роль пользователя")
    email: EmailStr = Field(..., description="Почта пользователя")
    password: str = Field(..., description="Пароль пользователя", min_length=6)
    phone: str | None = Field(None, description="Номер телефона пользователя")
    inn: str | None = Field(None, description="ИНН")
    company_data: dict[str, Any] | None = Field(None, description="Полные данные компании из DaData")
    first_name: str | None = Field(None, description="Имя", max_length=100)
    last_name: str | None = Field(None, description="Фамилия", max_length=100)
    location_lat: float | None = Field(None, description="Широта базирования эксперта", ge=-90, le=90)
    location_lng: float | None = Field(None, description="Долгота базирования эксперта", ge=-180, le=180)
    location_address: str | None = Field(None, description="Адрес базирования эксперта", max_length=500)
    location_city: str | None = Field(None, description="Город базирования эксперта", max_length=200)
    travels_to_other_regions: bool = Field(False, description="Готов выезжать на объекты в другие регионы")
    expert_certificates: list[ExpertCertificate] | None = Field(
        None, description="Удостоверения эксперта: область + объект + категория"
    )
    expert_show_on_map: bool = Field(True, description="Показывать эксперта на карте России")
    expert_map_fields: list[str] | None = Field(
        None, description="Какие поля показывать на карте: name/object/area/category/contacts"
    )
    contact_sales_enabled: bool = False
    contact_price_rubles: int | None = Field(None, ge=1, le=1_000_000)
    contact_payment_details: str | None = Field(None, max_length=1000)
    contact_disclosure_consent: bool = False

    @field_validator("company_data", mode="before")
    @classmethod
    def _validate_company_data(cls, value: Any) -> Any:
        return validate_company_data(value)

    @model_validator(mode="after")
    def validate_contact_offer(self) -> "UserRegistration":
        if not self.contact_sales_enabled:
            return self
        if self.role is not UserRole.EXPERT:
            raise ValueError("Платный доступ к контактам доступен только эксперту")
        if self.contact_price_rubles is None:
            raise ValueError("Укажите стоимость доступа к контактам")
        if not (self.contact_payment_details or "").strip():
            raise ValueError("Укажите реквизиты для прямого перевода")
        if not self.contact_disclosure_consent:
            raise ValueError("Подтвердите согласие на передачу контактов после оплаты")
        return self


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
    license_rental_percent: float | None = Field(None, gt=0, le=100)
    license_rental_fixed_amount: int | None = Field(None, gt=0)
    mining_license_number: str | None = Field(None, max_length=100)
    lab_accreditation_number: str | None = Field(None, max_length=100)

    @field_validator("company_data", mode="before")
    @classmethod
    def _validate_company_data(cls, value: Any) -> Any:
        return validate_company_data(value)

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
    "Подтверждение email по коду после регистрации."
    email: EmailStr = Field(..., description="Почта пользователя")
    code: str = Field(..., description="Код подтверждения")
    role: UserRole | None = Field(None, description="Если на email несколько ролей — какую подтверждаем")


class ResendCodeRequest(BaseModel):
    "Повторная отправка кода подтверждения email."
    email: EmailStr = Field(..., description="Почта пользователя")
    role: UserRole | None = Field(None, description="Если на email несколько ролей — какую переотправить")


class PartySuggestionRequest(BaseModel):
    "Запрос подсказок компании по строке поиска (DaData)."
    query: str = Field(..., min_length=2, max_length=200)
    count: int = Field(default=10, ge=1, le=10)


class PartySuggestionResponse(BaseModel):
    "Одна подсказка компании от DaData."
    value: str
    unrestricted_value: str
    data: dict[str, Any] = Field(default_factory=dict)


class UserResponse(BaseModel):
    "модель для ответа на фронтенд"
    id: int
    role: UserRole
    inn: str | None = None
    company_data: dict[str, Any] | None = None
    email: EmailStr | None = None
    phone: str | None = None
    created_at: datetime
    license_number: str | None = None
    license_file_url: str | None = None
    license_areas: list[str] | None = None
    license_rental_kind: LicenseRentalKind | None = None
    license_rental_percent: float | None = None
    license_rental_fixed_amount: int | None = None
    mining_license_number: str | None = None
    mining_license_file_url: str | None = None
    sro_design_file_url: str | None = None
    lab_accreditation_number: str | None = None
    lab_accreditation_file_url: str | None = None
    location_lat: float | None = None
    location_lng: float | None = None
    location_address: str | None = None
    location_city: str | None = None
    travels_to_other_regions: bool = False

    class Config:
        from_attributes = True
