from datetime import date, datetime

from pydantic import BaseModel, Field, model_validator

from models.labor import (
    CurrentJobStatus,
    EmploymentTerm,
    EmploymentType,
    LaborListingKind,
)


class LaborCertificate(BaseModel):
    area: str = Field(..., min_length=1, max_length=20)
    object: str | None = Field(None, max_length=20)
    category: str | None = Field(None, max_length=5)
    expires_at: str | None = Field(None, max_length=30)


class LaborListingCreate(BaseModel):
    kind: LaborListingKind
    certificates: list[LaborCertificate] = Field(..., min_length=1, max_length=100)
    region: str = Field(..., min_length=2, max_length=300)
    employment_term: EmploymentTerm
    fixed_term: str | None = Field(None, max_length=300)
    start_date: date | None = None
    employment_type: EmploymentType | None = None
    current_job_status: CurrentJobStatus | None = None

    @model_validator(mode="after")
    def validate_kind_fields(self) -> "LaborListingCreate":
        fixed_term_missing = (
            self.employment_term == EmploymentTerm.FIXED
            and not (self.fixed_term or "").strip()
        )
        if fixed_term_missing:
            raise ValueError("Укажите срок срочного трудового договора")

        if self.kind == LaborListingKind.EXPERT_WANTED:
            if self.start_date is None:
                raise ValueError("Укажите дату выхода на работу")
            if self.employment_type is None:
                raise ValueError("Укажите вид трудоустройства")

        job_status_missing = (
            self.kind == LaborListingKind.EXPERT_AVAILABLE
            and self.current_job_status is None
        )
        if job_status_missing:
            raise ValueError("Укажите текущее основное место работы")

        return self


class LaborListingResponse(BaseModel):
    id: int
    public_id: str
    owner_id: int
    owner_name: str
    owner_avatar_url: str | None = None
    kind: LaborListingKind
    certificates: list[LaborCertificate]
    region: str
    employment_term: EmploymentTerm
    fixed_term: str | None = None
    start_date: date | None = None
    employment_type: EmploymentType | None = None
    current_job_status: CurrentJobStatus | None = None
    is_active: bool
    is_mine: bool
    created_at: datetime


class LaborListingListResponse(BaseModel):
    items: list[LaborListingResponse]
    total: int


class LaborContactResponse(BaseModel):
    chat_uuid: str
