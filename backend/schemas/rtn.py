"Публичные DTO каталога «Ростехнадзор отвечает»: карточка, деталка, таксономия, обсуждение, обращения."

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field

DocumentTypeDto = Literal["OFFICIAL_CLARIFICATION", "INFO_LETTER", "RESPONSE_TO_REQUEST"]
ClarificationStatusDto = Literal["ACTIVE", "EXPIRED"]
CommentReactionValueDto = Literal["USEFUL", "CLARIFICATION", "AGREE"]


class RegulationLinkDto(BaseModel):
    "Гиперссылка на упомянутый в письме ФНП/ГОСТ/ФЗ."
    label: str
    url: str


class AttachmentDto(BaseModel):
    "Файл, приложенный к комментарию обсуждения."
    name: str
    url: str


class RtnTaxonomyOptionDto(BaseModel):
    "Одно значение справочника фильтров вместе с подписью на русском."
    value: str
    label: str


class RtnTaxonomyDto(BaseModel):
    "Полный справочник фильтров каталога — отдаётся один раз для построения формы фильтров на фронте."
    oversight_areas: list[RtnTaxonomyOptionDto]
    industries: list[RtnTaxonomyOptionDto]
    activities: list[RtnTaxonomyOptionDto]
    object_types: list[RtnTaxonomyOptionDto]
    document_types: list[RtnTaxonomyOptionDto]
    statuses: list[RtnTaxonomyOptionDto]


class RtnListItemDto(BaseModel):
    "Карточка разъяснения в списке результатов поиска."
    id: int
    slug: str
    title: str
    excerpt: str
    document_type: DocumentTypeDto
    status: ClarificationStatusDto
    letter_number: str
    department: str
    source_url: str
    pdf_url: str
    response_pdf_url: str
    tags: list[str]
    published_at: datetime | None


class RtnListDto(BaseModel):
    "Постраничный ответ со списком разъяснений."
    items: list[RtnListItemDto]
    has_more: bool


class RtnDetailDto(BaseModel):
    "Полная карточка разъяснения для страницы просмотра."
    id: int
    slug: str
    title: str
    excerpt: str
    document_type: DocumentTypeDto
    status: ClarificationStatusDto
    question_text: str
    answer_html: str
    letter_number: str
    department: str
    source_url: str
    pdf_url: str
    response_pdf_url: str
    referenced_regulations: list[RegulationLinkDto]
    tags: list[str]
    oversight_areas: list[RtnTaxonomyOptionDto]
    industries: list[RtnTaxonomyOptionDto]
    activities: list[RtnTaxonomyOptionDto]
    object_types: list[RtnTaxonomyOptionDto]
    meta_title: str
    meta_description: str
    meta_keywords: str
    published_at: datetime | None
    updated_at: datetime
    views_count: int
    likes_count: int
    dislikes_count: int


class RtnClarificationReactionRequest(BaseModel):
    value: Literal["LIKE", "DISLIKE"]


class RtnClarificationReactionResponse(BaseModel):
    likes_count: int
    dislikes_count: int
    views_count: int
    my_reaction: Literal["LIKE", "DISLIKE"] | None


class RtnClarificationViewResponse(BaseModel):
    views_count: int


class RtnCommentAuthorDto(BaseModel):
    "Данные автора комментария для карточки в обсуждении."
    name: str
    is_expert: bool


class RtnCommentDto(BaseModel):
    "Комментарий в «Профессиональном обсуждении» под разъяснением."
    id: int
    parent_id: int | None
    text: str
    author: RtnCommentAuthorDto
    attachments: list[AttachmentDto]
    created_at: datetime
    is_mine: bool
    useful_count: int
    clarification_count: int
    agree_count: int
    my_reaction: CommentReactionValueDto | None


class RtnCommentListResponse(BaseModel):
    items: list[RtnCommentDto]


class RtnCommentCreate(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    parent_id: int | None = None
    attachments: list[AttachmentDto] = Field(default_factory=list)


class RtnCommentReactionRequest(BaseModel):
    value: CommentReactionValueDto


class RtnCommentReactionResponse(BaseModel):
    useful_count: int
    clarification_count: int
    agree_count: int
    my_reaction: CommentReactionValueDto | None


class RtnQuestionCreate(BaseModel):
    "Форма «Не нашли ответ?»."
    question_text: str = Field(min_length=1, max_length=4000)
    contact_email: str = Field(default="", max_length=255)


class RtnChangeReportCreate(BaseModel):
    "Форма «Сообщить об изменении»."
    description: str = Field(min_length=1, max_length=4000)


class RtnListFiltersQuery(BaseModel):
    "Параметры фильтрации каталога, разобранные из query-строки."
    search: str | None = None
    document_types: list[DocumentTypeDto] = Field(default_factory=list)
    statuses: list[ClarificationStatusDto] = Field(default_factory=list)
    oversight_areas: list[str] = Field(default_factory=list)
    industries: list[str] = Field(default_factory=list)
    activities: list[str] = Field(default_factory=list)
    object_types: list[str] = Field(default_factory=list)
    published_from: date | None = None
    published_to: date | None = None
