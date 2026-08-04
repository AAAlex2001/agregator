"""DTO аудита СУПБ: анкеты заказчика и исполнителя, поля заявки с ветками формы."""
import re

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from models.audit import AuditKind, AuditParticipantKind, AuditScale, AuditTimeline
from schemas.common import DirectionFileSchema
from services.audit_catalogs import (
    ACCREDITATION_AREA_CODES,
    AUDIT_AREA_P17_CODES,
    AUDIT_QUALIFICATION_CODES,
    INDUSTRIAL_SAFETY_AREA_CODES,
)
from services.experts.badge_codes import ALL_BADGE_CODES_SET


def validate_catalog_codes(value: list[str], allowed: frozenset[str], label: str) -> list[str]:
    """Оставляет уникальные коды справочника, на неизвестных бросает ошибку валидации."""
    unknown = [code for code in value if code not in allowed]
    if unknown:
        raise ValueError(f"Недопустимые коды {label}: {', '.join(unknown)}")
    return list(dict.fromkeys(value))


class CatalogOption(BaseModel):
    """Позиция справочника для выпадающего списка: код и пояснение к нему."""
    model_config = ConfigDict(from_attributes=True)

    code: str
    title: str = ""


class AuditCatalogsResponse(BaseModel):
    """Справочники, из которых заполняются анкеты и заявка аудита СУПБ."""
    industrial_safety_areas: list[CatalogOption]
    expert_attestation_areas: list[CatalogOption]
    audit_qualifications: list[CatalogOption]
    accreditation_areas: list[CatalogOption]
    audit_areas: list[CatalogOption]


class AuditCustomerProfileInput(BaseModel):
    """Анкета заказчика по аудиту СУПБ."""
    position: str = Field("", max_length=200)
    opo_license_number: str = Field("", max_length=100)


class AuditCustomerProfileResponse(BaseModel):
    """Анкета заказчика по аудиту СУПБ в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    position: str = ""
    opo_license_number: str = ""


class AuditExpertProfileInput(BaseModel):
    """Анкета исполнителя по аудиту СУПБ: специалист или аккредитованный орган типа А."""
    participant_kind: AuditParticipantKind = AuditParticipantKind.AUDITOR
    industrial_safety_areas: list[str] = Field(default_factory=list, max_length=40)
    expert_attestation_areas: list[str] = Field(default_factory=list, max_length=60)
    audit_qualifications: list[str] = Field(default_factory=list, max_length=10)
    full_name: str = Field("", max_length=500)
    short_name: str = Field("", max_length=300)
    inn: str = Field("", max_length=12)
    certificate_number: str = Field("", max_length=100)
    accreditation_areas: list[str] = Field(default_factory=list, max_length=20)

    @field_validator("inn")
    @classmethod
    def check_inn(cls, value: str) -> str:
        """ИНН либо пустой, либо из 10 (юрлицо) или 12 (ИП) цифр."""
        inn = value.strip()
        if inn and not re.fullmatch(r"\d{10}|\d{12}", inn):
            raise ValueError("ИНН должен содержать 10 или 12 цифр")
        return inn

    @field_validator("industrial_safety_areas")
    @classmethod
    def check_industrial_safety_areas(cls, value: list[str]) -> list[str]:
        """Коды областей аттестации сверяются со справочником."""
        return validate_catalog_codes(value, INDUSTRIAL_SAFETY_AREA_CODES, "аттестации")

    @field_validator("expert_attestation_areas")
    @classmethod
    def check_expert_attestation_areas(cls, value: list[str]) -> list[str]:
        """Коды аттестации экспертов сверяются с общим справочником площадки."""
        return validate_catalog_codes(value, ALL_BADGE_CODES_SET, "аттестации экспертов")

    @field_validator("audit_qualifications")
    @classmethod
    def check_audit_qualifications(cls, value: list[str]) -> list[str]:
        """Коды НОК сверяются со справочником."""
        return validate_catalog_codes(value, AUDIT_QUALIFICATION_CODES, "НОК")

    @field_validator("accreditation_areas")
    @classmethod
    def check_accreditation_areas(cls, value: list[str]) -> list[str]:
        """Коды областей аккредитации сверяются со справочником."""
        return validate_catalog_codes(value, ACCREDITATION_AREA_CODES, "аккредитации")

    @model_validator(mode="after")
    def check_required_by_kind(self) -> "AuditExpertProfileInput":
        """У органа инспекции обязательны наименование, ИНН и свидетельство типа А."""
        if self.participant_kind is not AuditParticipantKind.INSPECTION_BODY:
            return self
        if not self.full_name.strip():
            raise ValueError("Укажите полное наименование инспекционного органа")
        if not self.inn:
            raise ValueError("Укажите ИНН инспекционного органа")
        if not self.certificate_number.strip():
            raise ValueError("Укажите номер свидетельства об аккредитации")
        return self


class AuditExpertProfileResponse(BaseModel):
    """Анкета исполнителя по аудиту СУПБ в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    participant_kind: AuditParticipantKind = AuditParticipantKind.AUDITOR
    industrial_safety_areas: list[str] = Field(default_factory=list)
    expert_attestation_areas: list[str] = Field(default_factory=list)
    audit_qualifications: list[str] = Field(default_factory=list)
    full_name: str = ""
    short_name: str = ""
    inn: str = ""
    certificate_number: str = ""
    accreditation_areas: list[str] = Field(default_factory=list)
    documents: list[DirectionFileSchema] = Field(default_factory=list)


class AuditOpoItemInput(BaseModel):
    """Один ОПО в заявке: регистрационные данные и признаки опасности."""
    registration_number: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=1, max_length=500)
    hazard_class: str = Field("", max_length=50)
    address: str = Field("", max_length=500)
    industry: str = Field("", max_length=500)
    hazard_signs: str = Field("", max_length=1000)


class AuditOpoItemResponse(AuditOpoItemInput):
    """ОПО заявки в ответе API."""
    model_config = ConfigDict(from_attributes=True)


class AuditOrderDetailsInput(BaseModel):
    """Поля заявки на аудит СУПБ: блоки 1-5 формы из ТЗ."""
    applicant_full_name: str = Field(..., min_length=1, max_length=300)
    applicant_position: str = Field("", max_length=200)
    applicant_organization: str = Field("", max_length=500)
    applicant_inn: str = Field("", pattern=r"^$|^\d{10}$|^\d{12}$")
    applicant_phone: str = Field(..., min_length=5, max_length=30)
    applicant_email: str = Field(..., min_length=5, max_length=320)
    audit_scale: AuditScale
    opo_items: list[AuditOpoItemInput] = Field(default_factory=list, max_length=50)
    opo_total: int | None = Field(None, ge=1, le=10_000)
    opo_class_1: int | None = Field(None, ge=0, le=10_000)
    opo_class_2: int | None = Field(None, ge=0, le=10_000)
    opo_class_3: int | None = Field(None, ge=0, le=10_000)
    opo_class_4: int | None = Field(None, ge=0, le=10_000)
    main_industry: str = Field("", max_length=500)
    multiple_regions: bool | None = None
    registration_certificate: DirectionFileSchema | None = None
    audit_kind: AuditKind
    considers_sto: bool | None = None
    sto_name: str = Field("", max_length=500)
    sto_file: DirectionFileSchema | None = None
    audit_areas: list[str] = Field(default_factory=list, max_length=18)
    desired_timeline: AuditTimeline
    comments: str = Field("", max_length=5000)

    @field_validator("audit_areas")
    @classmethod
    def check_audit_areas(cls, value: list[str]) -> list[str]:
        """Направления аудита сверяются со справочником пункта 17 Приказа 318."""
        return validate_catalog_codes(value, AUDIT_AREA_P17_CODES, "направлений аудита")

    @model_validator(mode="after")
    def check_scale_branch(self) -> "AuditOrderDetailsInput":
        """Масштаб аудита определяет, что обязательно: список ОПО или счётчики по классам."""
        if self.audit_scale is AuditScale.SINGLE_OPO and len(self.opo_items) != 1:
            raise ValueError("Для аудита одного ОПО укажите ровно один объект")
        if self.audit_scale is AuditScale.SELECTED_OPO and not self.opo_items:
            raise ValueError("Для аудита выборочных ОПО добавьте хотя бы один объект")
        if self.audit_scale is AuditScale.ALL_OPO:
            if self.opo_total is None:
                raise ValueError("Укажите общее количество ОПО")
            by_class = sum(
                count or 0
                for count in (self.opo_class_1, self.opo_class_2, self.opo_class_3, self.opo_class_4)
            )
            if by_class > self.opo_total:
                raise ValueError("Сумма ОПО по классам больше общего количества")
        return self

    @model_validator(mode="after")
    def check_kind_branch(self) -> "AuditOrderDetailsInput":
        """Тип аудита определяет, что обязательно дальше: СТО или направления по п.17."""
        if self.audit_kind in (AuditKind.BASIC, AuditKind.INTERIM):
            if self.considers_sto is None:
                raise ValueError("Укажите, учитывать ли внутренние стандарты организации")
            if self.considers_sto and not self.sto_name.strip():
                raise ValueError("Укажите наименование и реквизиты СТО")
            if self.considers_sto and self.sto_file is None:
                raise ValueError("Приложите файл СТО")
        if self.audit_kind is AuditKind.SELECTIVE and not self.audit_areas:
            raise ValueError("Выберите направление аудита по пункту 17 Приказа 318")
        return self


class AuditOrderDetailsResponse(BaseModel):
    """Поля заявки на аудит СУПБ в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    applicant_full_name: str
    applicant_position: str
    applicant_organization: str
    applicant_inn: str
    applicant_phone: str
    applicant_email: str
    audit_scale: AuditScale
    opo_items: list[AuditOpoItemResponse] = Field(default_factory=list)
    opo_total: int | None = None
    opo_class_1: int | None = None
    opo_class_2: int | None = None
    opo_class_3: int | None = None
    opo_class_4: int | None = None
    main_industry: str
    multiple_regions: bool | None = None
    registration_certificate: DirectionFileSchema | None = None
    audit_kind: AuditKind
    considers_sto: bool | None = None
    sto_name: str
    sto_file: DirectionFileSchema | None = None
    audit_areas: list[str] = Field(default_factory=list)
    desired_timeline: AuditTimeline
    comments: str
