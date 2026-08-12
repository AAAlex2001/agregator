"""DTO проектирования: анкеты проектировщика и держателя-члена СРО, поля заявки."""
from pydantic import BaseModel, ConfigDict, Field, field_validator

from schemas.applicant import ApplicantDetailsInput, ApplicantDetailsResponse
from schemas.common import DirectionFileSchema

DESIGN_PRICING_KINDS = ("PERCENT", "FIXED", "NEGOTIABLE")
DESIGN_ORDER_SCOPES = ("FULL", "SECTIONS")


class DesignCatalogOption(BaseModel):
    """Позиция справочника: код для хранения и название для интерфейса."""
    model_config = ConfigDict(from_attributes=True)

    code: str
    title: str


class DesignSpecialtyOption(DesignCatalogOption):
    """Специальность проектировщика: дополнительно шифр раздела ПД."""
    short: str


class DesignCatalogsResponse(BaseModel):
    """Справочники направления: специальности, области аттестации РТН и опции заявки."""
    specialties: list[DesignSpecialtyOption]
    rtn_areas: list[DesignCatalogOption]
    doc_categories: list[DesignCatalogOption]
    documentation_kinds: list[DesignCatalogOption]
    approvals: list[DesignCatalogOption]


class DesignExpertProfileInput(BaseModel):
    """Анкета проектировщика."""
    education: str = Field("", max_length=5000)
    specialties: list[str] = Field(default_factory=list, max_length=80)
    nok_passed: bool = False
    nrs_number: str = Field("", max_length=200)
    sro_gip_declared: bool = False
    qualification_courses: str = Field("", max_length=5000)
    rtn_areas: list[str] = Field(default_factory=list, max_length=100)


class DesignExpertProfileResponse(BaseModel):
    """Анкета проектировщика в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    education: str = ""
    specialties: list[str] = Field(default_factory=list)
    nok_passed: bool = False
    nrs_number: str = ""
    sro_gip_declared: bool = False
    qualification_courses: str = ""
    rtn_areas: list[str] = Field(default_factory=list)
    education_documents: list[DirectionFileSchema] = Field(default_factory=list)
    nok_documents: list[DirectionFileSchema] = Field(default_factory=list)
    nrs_documents: list[DirectionFileSchema] = Field(default_factory=list)
    qualification_documents: list[DirectionFileSchema] = Field(default_factory=list)
    rtn_documents: list[DirectionFileSchema] = Field(default_factory=list)


class DesignLicenseHolderProfileInput(BaseModel):
    """Анкета держателя — члена СРО проектировщиков."""
    sro_name: str = Field("", max_length=500)
    sro_registry_number: str = Field("", max_length=200)
    hazardous_objects_right: bool = False
    nuclear_objects_right: bool = False
    liability_level: int = Field(1, ge=1, le=4)
    pricing_kind: str = "PERCENT"
    pricing_percent: float | None = Field(None, gt=0, le=100)
    pricing_fixed_amount: int | None = Field(None, gt=0)

    @field_validator("pricing_kind")
    @classmethod
    def validate_pricing_kind(cls, value: str) -> str:
        if value not in DESIGN_PRICING_KINDS:
            raise ValueError("Неизвестный способ расчёта стоимости услуг")
        return value


class DesignLicenseHolderProfileResponse(BaseModel):
    """Анкета держателя — члена СРО в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    sro_name: str = ""
    sro_registry_number: str = ""
    hazardous_objects_right: bool = False
    nuclear_objects_right: bool = False
    liability_level: int = 1
    pricing_kind: str = "PERCENT"
    pricing_percent: float | None = None
    pricing_fixed_amount: int | None = None
    documents: list[DirectionFileSchema] = Field(default_factory=list)


class DesignOrderDetailsInput(ApplicantDetailsInput):
    """Поля заявки на проектирование."""
    object_name: str = Field("", max_length=500)
    construction_city: str = Field("", max_length=200)
    doc_categories: list[str] = Field(default_factory=list, max_length=10)
    documentation_kinds: list[str] = Field(default_factory=list, max_length=10)
    scope: str = "FULL"
    sections: list[str] = Field(default_factory=list, max_length=80)
    approvals: list[str] = Field(default_factory=list, max_length=10)
    approvals_other: str = Field("", max_length=2000)

    @field_validator("scope")
    @classmethod
    def validate_scope(cls, value: str) -> str:
        if value not in DESIGN_ORDER_SCOPES:
            raise ValueError("Неизвестный объём разрабатываемой документации")
        return value


class DesignOrderDetailsResponse(ApplicantDetailsResponse):
    """Поля заявки на проектирование в ответе API."""
    object_name: str = ""
    construction_city: str = ""
    doc_categories: list[str] = Field(default_factory=list)
    documentation_kinds: list[str] = Field(default_factory=list)
    scope: str = "FULL"
    sections: list[str] = Field(default_factory=list)
    approvals: list[str] = Field(default_factory=list)
    approvals_other: str = ""
