from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from schemas.company import validate_company_data


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
    expert_areas: list[str] | None = Field(None, description="Области аттестации эксперта (Э-коды ОПО)")
    expert_objects: list[str] | None = Field(None, description="Объекты экспертизы (КЛ/ТП, ТУ, ЗС, Д, ОБ)")
    expert_categories: list[str] | None = Field(None, description="Категории эксперта (1/2/3)")
    expert_map_fields: list[str] | None = Field(None, description="Какие поля показывать на карте России")

    @field_validator("company_data", mode="before")
    @classmethod
    def _validate_company_data(cls, value: Any) -> Any:
        return validate_company_data(value)


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
