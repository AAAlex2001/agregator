import re
from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from models.account import Account, UserRole
from models.license_holder import LicenseRentalKind
from schemas.audit import (
    AuditCustomerProfileInput,
    AuditExpertProfileInput,
    AuditLicenseHolderProfileInput,
)
from schemas.cadastral import CadastralProfileInput
from schemas.company import validate_company_data
from schemas.expertise import ExpertiseProfileInput
from schemas.forensic import ForensicProfileInput
from schemas.laboratory import LaboratoryProfileInput
from schemas.research import ResearchProfileInput
from schemas.tech_diag import TechDiagExpertProfileInput, TechDiagLicenseHolderProfileInput
from services.directions.registry import validate_direction_keys

PASSWORD_ALLOWED_CHARS = re.compile(r"^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'\",.<>?/`~ ]+$")


def validate_password_complexity(value: str) -> str:
    if not re.search(r"[A-Z]", value):
        raise ValueError("Пароль должен содержать заглавную латинскую букву")
    if not re.search(r"[a-z]", value):
        raise ValueError("Пароль должен содержать строчную латинскую букву")
    if not PASSWORD_ALLOWED_CHARS.match(value):
        raise ValueError("Пароль может содержать только латинские буквы, цифры и спецсимволы")
    return value


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
    show_on_map: bool = Field(True, description="Показывать исполнителя на карте России")
    map_fields: list[str] = Field(
        default_factory=list, description="Что показывать в метке на карте", max_length=30
    )
    directions: list[str] = Field(
        default_factory=list, description="Отметки направлений без анкет", max_length=10
    )
    expertise_profile: ExpertiseProfileInput | None = None
    audit_expert_profile: AuditExpertProfileInput | None = None
    audit_customer_profile: AuditCustomerProfileInput | None = None
    cadastral_profile: CadastralProfileInput | None = None
    forensic_profile: ForensicProfileInput | None = None
    research_profile: ResearchProfileInput | None = None
    laboratory_profile: LaboratoryProfileInput | None = None
    tech_diag_profile: TechDiagExpertProfileInput | None = None
    contact_sales_enabled: bool = False
    contact_price_rubles: int | None = Field(None, ge=1, le=1_000_000)
    contact_payment_details: str | None = Field(None, max_length=1000)
    contact_disclosure_consent: bool = False

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password_complexity(value)

    @field_validator("company_data", mode="before")
    @classmethod
    def validate_company(cls, value: Any) -> Any:
        return validate_company_data(value)

    @field_validator("directions")
    @classmethod
    def validate_directions(cls, value: list[str]) -> list[str]:
        return validate_direction_keys(value)

    @model_validator(mode="after")
    def validate_direction_roles(self) -> "UserRegistration":
        """Анкеты направлений заполняет только та роль, которой они принадлежат."""
        expert_forms = (
            self.expertise_profile,
            self.audit_expert_profile,
            self.cadastral_profile,
            self.forensic_profile,
            self.research_profile,
            self.laboratory_profile,
            self.tech_diag_profile,
        )
        if self.role is not UserRole.EXPERT and any(form is not None for form in expert_forms):
            raise ValueError("Анкеты направлений исполнителя доступны только исполнителю")
        if self.role is not UserRole.CUSTOMER and self.audit_customer_profile is not None:
            raise ValueError("Анкета заказчика по аудиту доступна только заказчику")
        return self

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
    """Регистрация держателя разрешительных документов.

    Обычный держатель приходит с лицензией ЭПБ; инспекционный орган по аудиту СУПБ —
    со свидетельством об аккредитации (audit_profile), лицензия ему не обязательна.
    Файл лицензии передаётся отдельным multipart-полем.
    """
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str = Field(..., min_length=10)
    inn: str = Field(..., min_length=10, max_length=12, pattern=r"^\d{10}(\d{2})?$")
    company_data: dict[str, Any]
    license_number: str | None = Field(None, max_length=100)
    license_areas: list[str] = Field(default_factory=list)
    license_rental_kind: LicenseRentalKind | None = None
    license_rental_percent: float | None = Field(None, gt=0, le=100)
    license_rental_fixed_amount: int | None = Field(None, gt=0)
    mining_license_number: str | None = Field(None, max_length=100)
    lab_accreditation_number: str | None = Field(None, max_length=100)
    audit_profile: AuditLicenseHolderProfileInput | None = None
    tech_diag_profile: TechDiagLicenseHolderProfileInput | None = None
    directions: list[str] = Field(
        default_factory=list, description="Отметки направлений без анкет", max_length=10
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password_complexity(value)

    @field_validator("company_data", mode="before")
    @classmethod
    def validate_company(cls, value: Any) -> Any:
        return validate_company_data(value)

    @field_validator("directions")
    @classmethod
    def validate_directions(cls, value: list[str]) -> list[str]:
        return validate_direction_keys(value)

    @model_validator(mode="after")
    def cross_field_checks(self) -> "LicenseHolderRegistration":
        company_inn = (self.company_data.get("data") or {}).get("inn")
        if company_inn and company_inn != self.inn:
            raise ValueError("Выбранная компания не соответствует указанному ИНН")
        if self.audit_profile is None and self.tech_diag_profile is None:
            if not (self.license_number or "").strip():
                raise ValueError("Укажите номер лицензии")
            if not self.license_areas:
                raise ValueError("Выберите хотя бы один объект экспертизы")
            if self.license_rental_kind is None:
                raise ValueError("Выберите способ расчёта стоимости предоставления лицензии")
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

    @classmethod
    def from_account(cls, account: Account) -> "UserResponse":
        "Собирает ответ из аккаунта и профилей роли: старые имена полей — из новых мест."
        expert = account.expert_profile
        holder = account.license_holder_profile
        return cls(
            id=account.id,
            role=account.role,
            inn=account.inn,
            company_data=account.company_data,
            email=account.email,
            phone=account.phone,
            created_at=account.created_at,
            license_number=holder.license_number if holder else None,
            license_file_url=holder.license_file_url if holder else None,
            license_areas=holder.license_areas if holder else None,
            license_rental_kind=(
                LicenseRentalKind(holder.license_rental_kind)
                if holder and holder.license_rental_kind
                else None
            ),
            license_rental_percent=(
                float(holder.license_rental_percent)
                if holder and holder.license_rental_percent is not None
                else None
            ),
            license_rental_fixed_amount=holder.license_rental_fixed_amount if holder else None,
            mining_license_number=holder.mining_license_number if holder else None,
            mining_license_file_url=holder.mining_license_file_url if holder else None,
            sro_design_file_url=holder.sro_design_file_url if holder else None,
            lab_accreditation_number=holder.lab_accreditation_number if holder else None,
            lab_accreditation_file_url=holder.lab_accreditation_file_url if holder else None,
            location_lat=expert.location_lat if expert else None,
            location_lng=expert.location_lng if expert else None,
            location_address=expert.location_address if expert else None,
            location_city=expert.location_city if expert else None,
            travels_to_other_regions=expert.travels_to_other_regions if expert else False,
        )
