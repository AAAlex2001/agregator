"""DTO кадастровых работ: анкета инженера и поля заявки."""
from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from schemas.common import DirectionFileSchema


class CadastralProfileInput(BaseModel):
    """Анкета кадастрового инженера из формы регистрации или кабинета."""
    education: str = Field("", max_length=5000)
    registry_joined_at: date | None = None
    certificate_number: str | None = Field(None, max_length=100)
    registry_number: str | None = Field(None, max_length=100)
    has_equipment: bool = False
    city: str = Field("", max_length=200)
    workplace: str = Field("", max_length=500)


class CadastralProfileResponse(BaseModel):
    """Анкета кадастрового инженера в ответе API: с приложенными файлами."""
    model_config = ConfigDict(from_attributes=True)

    education: str = ""
    registry_joined_at: date | None = None
    certificate_number: str | None = None
    registry_number: str | None = None
    has_equipment: bool = False
    city: str = ""
    workplace: str = ""
    education_diploma: DirectionFileSchema | None = None
    certificate_file: DirectionFileSchema | None = None
    documents: list[DirectionFileSchema] = Field(default_factory=list)


class CadastralOrderDetailsInput(BaseModel):
    """Поля заявки на кадастровые работы: заявитель, работа, требования, сроки."""
    applicant_full_name: str = Field(..., min_length=1, max_length=300)
    applicant_position: str = Field("", max_length=200)
    applicant_organization: str = Field("", max_length=500)
    applicant_inn: str = Field("", pattern=r"^$|^\d{10}$|^\d{12}$")
    applicant_phone: str = Field(..., min_length=5, max_length=30)
    applicant_email: str = Field(..., min_length=5, max_length=320)
    work_purpose: str = Field(..., min_length=1, max_length=5000)
    city: str = Field(..., min_length=1, max_length=200)
    education_requirement: str = Field("", max_length=5000)
    sro_required: bool = False
    duration: str = Field("", max_length=200)


class CadastralOrderDetailsResponse(BaseModel):
    """Поля кадастровой заявки в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    applicant_full_name: str
    applicant_position: str
    applicant_organization: str
    applicant_inn: str
    applicant_phone: str
    applicant_email: str
    work_purpose: str
    city: str
    education_requirement: str
    sro_required: bool = False
    duration: str
