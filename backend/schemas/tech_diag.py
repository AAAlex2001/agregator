"""DTO техдиагностирования: анкеты специалиста НК и лаборатории, поля заявки."""
from pydantic import BaseModel, ConfigDict, Field

from schemas.applicant import ApplicantDetailsInput, ApplicantDetailsResponse
from schemas.common import DirectionFileSchema


class TechDiagCatalogOption(BaseModel):
    """Позиция справочника: код для хранения и название для интерфейса."""
    model_config = ConfigDict(from_attributes=True)

    code: str
    title: str


class TechDiagCatalogsResponse(BaseModel):
    """Справочники направления: виды НК и объекты контроля по СДАНК-02-2020."""
    methods: list[TechDiagCatalogOption]
    control_objects: list[TechDiagCatalogOption]


class TechDiagExpertProfileInput(BaseModel):
    """Анкета специалиста НК (дефектоскописта)."""
    qualification_certificates: str = Field("", max_length=5000)
    methods: list[str] = Field(default_factory=list, max_length=20)
    control_objects: list[str] = Field(default_factory=list, max_length=20)


class TechDiagExpertProfileResponse(BaseModel):
    """Анкета специалиста НК в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    qualification_certificates: str = ""
    methods: list[str] = Field(default_factory=list)
    control_objects: list[str] = Field(default_factory=list)
    documents: list[DirectionFileSchema] = Field(default_factory=list)


class TechDiagLicenseHolderProfileInput(BaseModel):
    """Анкета лаборатории неразрушающего контроля."""
    methods: list[str] = Field(default_factory=list, max_length=20)
    organization_city: str = Field("", max_length=200)


class TechDiagLicenseHolderProfileResponse(BaseModel):
    """Анкета лаборатории НК в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    methods: list[str] = Field(default_factory=list)
    organization_city: str = ""


class TechDiagOrderDetailsInput(ApplicantDetailsInput):
    """Поля заявки на техническое освидетельствование и диагностирование."""
    purpose: str = Field("", max_length=5000)
    object_city: str = Field("", max_length=200)
    duration: str = Field("", max_length=200)


class TechDiagOrderDetailsResponse(ApplicantDetailsResponse):
    """Поля заявки в ответе API."""
    purpose: str = ""
    object_city: str = ""
    duration: str = ""
