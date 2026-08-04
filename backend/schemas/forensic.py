"""DTO судебной экспертизы: анкета эксперта и поля заявки."""
from pydantic import BaseModel, ConfigDict, Field, model_validator

from models.forensic import ForensicWorkplaceKind


class ForensicFile(BaseModel):
    """Приложенный к анкете файл: имя для показа и ссылка на хранилище."""
    name: str = Field(..., min_length=1, max_length=300)
    url: str = Field(..., min_length=1, max_length=500)


class ForensicProfileInput(BaseModel):
    """Анкета судебного эксперта из формы регистрации или кабинета."""
    education: str = Field("", max_length=5000)
    extra_education: str = Field("", max_length=5000)
    has_similar_experience: bool = False
    has_degree: bool = False
    degree: str = Field("", max_length=300)
    city: str = Field("", max_length=200)
    workplace_kind: ForensicWorkplaceKind = ForensicWorkplaceKind.INDIVIDUAL
    workplace_name: str = Field("", max_length=500)

    @model_validator(mode="after")
    def degree_requires_flag(self) -> "ForensicProfileInput":
        """Учёная степень указывается только вместе с ответом «да»."""
        if self.has_degree and not self.degree.strip():
            raise ValueError("Укажите учёную степень")
        if not self.has_degree:
            self.degree = ""
        return self


class ForensicProfileResponse(ForensicProfileInput):
    """Анкета судебного эксперта в ответе API: с приложенными файлами."""
    model_config = ConfigDict(from_attributes=True)

    education_diploma: ForensicFile | None = None
    documents: list[ForensicFile] = Field(default_factory=list)


class ForensicOrderDetailsInput(BaseModel):
    """Поля заявки на судебную экспертизу: заявитель, объект, требования, сроки."""
    applicant_full_name: str = Field(..., min_length=1, max_length=300)
    applicant_position: str = Field("", max_length=200)
    applicant_organization: str = Field("", max_length=500)
    applicant_inn: str = Field("", pattern=r"^$|^\d{10}$|^\d{12}$")
    applicant_phone: str = Field(..., min_length=5, max_length=30)
    applicant_email: str = Field(..., min_length=5, max_length=320)
    expertise_purpose: str = Field(..., min_length=1, max_length=5000)
    government_body: str = Field(..., min_length=1, max_length=500)
    city: str = Field(..., min_length=1, max_length=200)
    education_requirement: str = Field("", max_length=5000)
    extra_requirements: str = Field("", max_length=5000)
    similar_experience_required: bool = False
    duration: str = Field("", max_length=200)


class ForensicOrderDetailsResponse(ForensicOrderDetailsInput):
    """Поля судебной заявки в ответе API."""
    model_config = ConfigDict(from_attributes=True)
