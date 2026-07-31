from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field, model_validator

from models.account import UserRole
from models.labor import (
    CurrentJobStatus,
    EmploymentTerm,
    EmploymentType,
    LaborListingKind,
)


class LaborCertificate(BaseModel):
    area: str | None = Field(None, max_length=20)
    object: str | None = Field(None, max_length=20)
    category: str | None = Field(None, max_length=5)
    expires_at: str | None = Field(None, max_length=30)

    @model_validator(mode="after")
    def validate_expertise(self) -> "LaborCertificate":
        has_area = bool((self.area or "").strip())
        has_object = bool((self.object or "").strip())
        if not has_area and not has_object:
            raise ValueError("Укажите область или вид экспертизы")
        return self


class LaborListingCreate(BaseModel):
    client_request_id: UUID | None = None
    kind: LaborListingKind
    certificates: list[LaborCertificate] = Field(default_factory=list, max_length=100)
    other_profession: str | None = Field(None, max_length=500)
    region: str = Field(..., min_length=2, max_length=300)
    employment_term: EmploymentTerm
    fixed_term: str | None = Field(None, max_length=300)
    start_date: date | None = None
    employment_type: EmploymentType | None = None
    current_job_status: CurrentJobStatus | None = None

    @model_validator(mode="after")
    def validate_kind_fields(self) -> "LaborListingCreate":
        has_other_profession = bool((self.other_profession or "").strip())
        if not has_other_profession and not self.certificates:
            raise ValueError("Выберите удостоверение, вид экспертизы или опишите иную профессию")

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


class LaborResponderResponse(BaseModel):
    user_id: int
    public_id: str
    name: str
    avatar_url: str | None = None
    role: UserRole
    responded_at: datetime
    chat_uuid: str


class LaborListingResponse(BaseModel):
    id: int
    public_id: str
    owner_id: int
    owner_name: str
    owner_avatar_url: str | None = None
    kind: LaborListingKind
    certificates: list[LaborCertificate]
    other_profession: str | None = None
    region: str
    employment_term: EmploymentTerm
    fixed_term: str | None = None
    start_date: date | None = None
    employment_type: EmploymentType | None = None
    current_job_status: CurrentJobStatus | None = None
    is_active: bool
    is_mine: bool
    created_at: datetime
    responders: list[LaborResponderResponse] = Field(default_factory=list)


class LaborListingListResponse(BaseModel):
    items: list[LaborListingResponse]
    total: int


class LaborContactResponse(BaseModel):
    chat_uuid: str
