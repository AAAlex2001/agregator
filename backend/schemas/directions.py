"""DTO направлений: профили исполнителя и детали заявок."""
import re
from datetime import date

from pydantic import BaseModel, Field, field_validator, model_validator

from models.direction_profile import AuditParticipantKind, ForensicWorkplaceKind
from models.license_holder import LicenseRentalKind
from schemas.expert import ExpertCertificate
from services.audit_catalogs import (
    ACCREDITATION_AREA_CODES,
    AUDIT_QUALIFICATION_CODES,
    INDUSTRIAL_SAFETY_AREA_CODES,
)
from services.experts.badge_codes import ALL_BADGE_CODES_SET


def validate_catalog_codes(value: list[str], allowed: frozenset[str], label: str) -> list[str]:
    "Оставляет уникальные коды справочника, на неизвестных бросает ошибку валидации."
    unknown = [code for code in value if code not in allowed]
    if unknown:
        raise ValueError(f"Недопустимые коды {label}: {', '.join(unknown)}")
    return list(dict.fromkeys(value))


class DirectionDocument(BaseModel):
    "Загруженный документ профиля направления: диплом, аттестат, курс."
    name: str = Field(..., min_length=1, max_length=300)
    url: str = Field(..., min_length=1, max_length=500)


class DirectionDocumentsResponse(BaseModel):
    "Актуальный список документов анкеты направления."
    documents: list[DirectionDocument]


class DirectionDocumentDelete(BaseModel):
    "Ссылка на удаляемый документ анкеты."
    url: str = Field(..., min_length=1, max_length=500)


class CadastralProfileInput(BaseModel):
    "Анкета кадастрового инженера."
    education: str = Field("", max_length=5000)
    registry_joined_at: date | None = None
    certificate_number: str | None = Field(None, max_length=100)
    registry_number: str | None = Field(None, max_length=100)
    equipment: str = Field("", max_length=5000)
    workplace: str = Field("", max_length=500)
    documents: list[DirectionDocument] = Field(default_factory=list)


class CadastralProfileResponse(CadastralProfileInput):
    "Анкета кадастрового инженера в ответе API."

    class Config:
        from_attributes = True


class ForensicProfileInput(BaseModel):
    "Анкета специалиста по судебной экспертизе."
    education: str = Field("", max_length=5000)
    similar_cases_experience: str = Field("", max_length=5000)
    workplace_kind: ForensicWorkplaceKind = ForensicWorkplaceKind.INDIVIDUAL
    workplace_name: str = Field("", max_length=500)
    documents: list[DirectionDocument] = Field(default_factory=list)


class ForensicProfileResponse(ForensicProfileInput):
    "Анкета судебного эксперта в ответе API."

    class Config:
        from_attributes = True


class CadastralOrderDetailsInput(BaseModel):
    "Дополнительные поля заявки на кадастровые работы."
    work_location: str = Field(..., min_length=1, max_length=500)


class CadastralOrderDetailsResponse(CadastralOrderDetailsInput):
    "Детали кадастровой заявки в ответе API."

    class Config:
        from_attributes = True


class ForensicOrderDetailsInput(BaseModel):
    "Дополнительные поля заявки на судебную экспертизу."
    government_body: str = Field(..., min_length=1, max_length=500)
    expert_requirements: str = Field(..., min_length=1, max_length=5000)
    subject_location: str = Field(..., min_length=1, max_length=500)


class ForensicOrderDetailsResponse(ForensicOrderDetailsInput):
    "Детали судебной заявки в ответе API."

    class Config:
        from_attributes = True


class ExpertiseExpertProfileInput(BaseModel):
    """Анкета исполнителя по экспертизе промышленной безопасности.

    Присутствие на карте сюда не входит: это настройка исполнителя, общая для всех
    направлений, и живёт в PUT /settings/expert-location.
    """
    certificates: list[ExpertCertificate] = Field(default_factory=list, max_length=200)


class ExpertiseExpertProfileResponse(ExpertiseExpertProfileInput):
    "Анкета исполнителя по ЭПБ в ответе API."

    class Config:
        from_attributes = True


class ExpertiseLicenseHolderProfileInput(BaseModel):
    "Анкета держателя разрешительных документов по экспертизе промышленной безопасности."
    license_number: str = Field(..., min_length=1, max_length=100)
    license_areas: list[str] = Field(..., min_length=1, max_length=20)
    license_rental_kind: LicenseRentalKind
    license_rental_percent: float | None = Field(None, gt=0, le=100)
    license_rental_fixed_amount: int | None = Field(None, gt=0)
    mining_license_number: str = Field("", max_length=100)
    lab_accreditation_number: str = Field("", max_length=100)

    @model_validator(mode="after")
    def check_rental_amount(self) -> "ExpertiseLicenseHolderProfileInput":
        "Способ расчёта аренды требует соответствующей суммы."
        if self.license_rental_kind is LicenseRentalKind.PERCENT and self.license_rental_percent is None:
            raise ValueError("Укажите процент от суммы договора")
        if self.license_rental_kind is LicenseRentalKind.FIXED and self.license_rental_fixed_amount is None:
            raise ValueError("Укажите минимальную фиксированную цену предоставления лицензии")
        return self


class ExpertiseLicenseHolderProfileResponse(ExpertiseLicenseHolderProfileInput):
    "Анкета держателя по ЭПБ в ответе API."

    class Config:
        from_attributes = True


class CustomerAuditProfileInput(BaseModel):
    "Анкета заказчика по аудиту СУПБ."
    position: str = Field("", max_length=200)
    opo_license_number: str = Field("", max_length=100)


class CustomerAuditProfileResponse(CustomerAuditProfileInput):
    "Анкета заказчика по аудиту СУПБ в ответе API."

    class Config:
        from_attributes = True


class AuditProfileInput(BaseModel):
    "Анкета исполнителя по аудиту СУПБ: специалист или аккредитованный орган типа А."
    participant_kind: AuditParticipantKind = AuditParticipantKind.AUDITOR
    industrial_safety_areas: list[str] = Field(default_factory=list, max_length=40)
    expert_attestation_areas: list[str] = Field(default_factory=list, max_length=60)
    audit_qualifications: list[str] = Field(default_factory=list, max_length=10)
    full_name: str = Field("", max_length=500)
    short_name: str = Field("", max_length=300)
    inn: str = Field("", max_length=12)
    certificate_number: str = Field("", max_length=100)
    accreditation_areas: list[str] = Field(default_factory=list, max_length=20)
    documents: list[DirectionDocument] = Field(default_factory=list)

    @field_validator("inn")
    @classmethod
    def check_inn(cls, value: str) -> str:
        "ИНН либо пустой, либо из 10 (юрлицо) или 12 (ИП) цифр."
        inn = value.strip()
        if inn and not re.fullmatch(r"\d{10}|\d{12}", inn):
            raise ValueError("ИНН должен содержать 10 или 12 цифр")
        return inn

    @field_validator("industrial_safety_areas")
    @classmethod
    def check_industrial_safety_areas(cls, value: list[str]) -> list[str]:
        "Коды областей аттестации сверяются со справочником."
        return validate_catalog_codes(value, INDUSTRIAL_SAFETY_AREA_CODES, "аттестации")

    @field_validator("expert_attestation_areas")
    @classmethod
    def check_expert_attestation_areas(cls, value: list[str]) -> list[str]:
        "Коды аттестации экспертов сверяются с общим справочником площадки."
        return validate_catalog_codes(value, ALL_BADGE_CODES_SET, "аттестации экспертов")

    @field_validator("audit_qualifications")
    @classmethod
    def check_audit_qualifications(cls, value: list[str]) -> list[str]:
        "Коды НОК сверяются со справочником."
        return validate_catalog_codes(value, AUDIT_QUALIFICATION_CODES, "НОК")

    @field_validator("accreditation_areas")
    @classmethod
    def check_accreditation_areas(cls, value: list[str]) -> list[str]:
        "Коды областей аккредитации сверяются со справочником."
        return validate_catalog_codes(value, ACCREDITATION_AREA_CODES, "аккредитации")

    @model_validator(mode="after")
    def check_required_by_kind(self) -> "AuditProfileInput":
        "У органа инспекции обязательны наименование, ИНН и свидетельство типа А."
        if self.participant_kind is not AuditParticipantKind.INSPECTION_BODY:
            return self
        if not self.full_name.strip():
            raise ValueError("Укажите полное наименование инспекционного органа")
        if not self.inn:
            raise ValueError("Укажите ИНН инспекционного органа")
        if not self.certificate_number.strip():
            raise ValueError("Укажите номер свидетельства об аккредитации")
        return self


class AuditProfileResponse(AuditProfileInput):
    "Анкета аудита СУПБ в ответе API."

    class Config:
        from_attributes = True


class ResearchOrderDetailsInput(BaseModel):
    "Дополнительные поля заявки на проведение НИР."
    executor_requirements: list[str] = Field(default_factory=list, max_length=20)
    needs_site_visit: bool = False

    @field_validator("executor_requirements")
    @classmethod
    def drop_blank_requirements(cls, value: list[str]) -> list[str]:
        "Пустые строки из динамического списка «добавить поле» не сохраняются."
        return [item.strip() for item in value if item.strip()]


class ResearchOrderDetailsResponse(ResearchOrderDetailsInput):
    "Детали заявки на НИР в ответе API."

    class Config:
        from_attributes = True


class LaboratoryOrderDetailsInput(BaseModel):
    "Дополнительные поля заявки на проведение лабораторных исследований."
    equipment_requirements: str = Field("", max_length=5000)


class LaboratoryOrderDetailsResponse(LaboratoryOrderDetailsInput):
    "Детали лабораторной заявки в ответе API."

    class Config:
        from_attributes = True


class DirectionSummary(BaseModel):
    "Направление в списке ЛК: ключ, название, заполнен ли профиль."
    key: str
    title: str
    profile_filled: bool


class CatalogOption(BaseModel):
    "Позиция справочника для выпадающего списка: код и пояснение к нему."
    code: str
    title: str = ""

    class Config:
        from_attributes = True


class DirectionCatalogsResponse(BaseModel):
    "Справочники, из которых заполняются анкеты направлений."
    industrial_safety_areas: list[CatalogOption]
    expert_attestation_areas: list[CatalogOption]
    audit_qualifications: list[CatalogOption]
    accreditation_areas: list[CatalogOption]
