"""DTO НИР: анкета исполнителя и поля заявки."""
from pydantic import BaseModel, ConfigDict, Field, field_validator

from schemas.applicant import ApplicantDetailsInput, ApplicantDetailsResponse


class ResearchCatalogOption(BaseModel):
    """Позиция справочника: код для хранения и название для интерфейса."""
    model_config = ConfigDict(from_attributes=True)

    code: str
    title: str


class ResearchCatalogsResponse(BaseModel):
    """Справочники направления: степени, отрасли науки и звания."""
    academic_degrees: list[ResearchCatalogOption]
    science_branches: list[ResearchCatalogOption]
    academic_titles: list[ResearchCatalogOption]


class ResearchProfileInput(BaseModel):
    """Анкета исполнителя НИР из формы регистрации или кабинета."""
    academic_degree: str = Field("", max_length=300)
    science_branches: list[str] = Field(default_factory=list, max_length=30)
    academic_title: str = Field("", max_length=300)
    research_field: str = Field("", max_length=5000)


class ResearchProfileResponse(BaseModel):
    """Анкета исполнителя НИР в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    academic_degree: str = ""
    science_branches: list[str] = Field(default_factory=list)
    academic_title: str = ""
    research_field: str = ""


class ResearchOrderDetailsInput(ApplicantDetailsInput):
    """Поля заявки на проведение НИР."""
    executor_requirements: list[str] = Field(default_factory=list, max_length=20)
    needs_site_visit: bool = False

    @field_validator("executor_requirements")
    @classmethod
    def drop_blank_requirements(cls, value: list[str]) -> list[str]:
        """Пустые строки из динамического списка «добавить поле» не сохраняются."""
        return [item.strip() for item in value if item.strip()]


class ResearchOrderDetailsResponse(ApplicantDetailsResponse):
    """Поля заявки на НИР в ответе API."""
    executor_requirements: list[str] = Field(default_factory=list)
    needs_site_visit: bool = False
