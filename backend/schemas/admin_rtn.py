"Административные DTO разъяснений РТН для admin-next: полная карточка со всей таксономией."

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from schemas.rtn import AttachmentDto, RegulationLinkDto

DocumentType = Literal["OFFICIAL_CLARIFICATION", "INFO_LETTER", "RESPONSE_TO_REQUEST"]
ClarificationStatus = Literal["ACTIVE", "EXPIRED"]
PublicationStatus = Literal["DRAFT", "PUBLISHED"]


class RtnClarificationWrite(BaseModel):
    document_type: DocumentType
    status: ClarificationStatus
    publication_status: PublicationStatus
    slug: str = Field(min_length=1, max_length=220)
    title: str = Field(default="", max_length=300)
    excerpt: str = ""
    question_text: str = ""
    answer_html: str = ""
    letter_number: str = Field(default="", max_length=100)
    department: str = Field(default="", max_length=300)
    source_url: str = Field(default="", max_length=500)
    pdf_url: str = Field(default="", max_length=500)
    response_pdf_url: str = Field(default="", max_length=500)
    referenced_regulations: list[RegulationLinkDto] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    oversight_areas: list[str] = Field(default_factory=list)
    industries: list[str] = Field(default_factory=list)
    activities: list[str] = Field(default_factory=list)
    object_types: list[str] = Field(default_factory=list)
    meta_title: str = Field(default="", max_length=300)
    meta_description: str = ""
    meta_keywords: str = ""
    published_at: datetime | None = None


class RtnClarificationOut(RtnClarificationWrite):
    id: int
    views_count: int
    created_at: datetime
    updated_at: datetime


class RtnClarificationListItem(BaseModel):
    id: int
    document_type: DocumentType
    status: ClarificationStatus
    publication_status: PublicationStatus
    title: str
    slug: str
    letter_number: str
    published_at: datetime | None
    updated_at: datetime


class RtnClarificationListOut(BaseModel):
    items: list[RtnClarificationListItem]
    total: int


class RtnQuestionOut(BaseModel):
    "Вопрос из формы «Не нашли ответ?» — очередь модерации в админке."
    id: int
    question_text: str
    contact_email: str
    status: Literal["NEW", "PUBLISHED", "DISMISSED"]
    answered_clarification_id: int | None
    created_at: datetime


class RtnQuestionListOut(BaseModel):
    items: list[RtnQuestionOut]


class RtnChangeReportOut(BaseModel):
    "Сообщение «об изменении» — очередь модерации в админке."
    id: int
    clarification_id: int
    description: str
    status: Literal["NEW", "REVIEWED", "APPLIED"]
    created_at: datetime


class RtnChangeReportListOut(BaseModel):
    items: list[RtnChangeReportOut]


class RtnAttachmentUploadOut(BaseModel):
    url: str


__all__ = [
    "AttachmentDto",
    "RtnAttachmentUploadOut",
    "RtnChangeReportListOut",
    "RtnChangeReportOut",
    "RtnClarificationListItem",
    "RtnClarificationListOut",
    "RtnClarificationOut",
    "RtnClarificationWrite",
    "RtnQuestionListOut",
    "RtnQuestionOut",
]
