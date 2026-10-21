"""Заявка на аудит СУПБ, торг по цене, группа и План аудита в API."""

from datetime import date, datetime
from decimal import Decimal
from typing import Literal, Self

from pydantic import BaseModel, EmailStr, Field, model_validator

from app.blitz.audit.options import (
    AUDIT_KINDS,
    BUDGETS,
    ELEMENTS,
    HAZARD_CLASSES,
    HAZARD_SIGNS,
    MIN_AUDIT_PRICE,
    NEGOTIATIONS,
    SCOPES,
    STAGES,
    TIMINGS,
)
from app.blitz.orders.models import COMPANY_CUSTOMERS, CustomerType
from app.blitz.orders.schemas import MAX_PRICE, ChoiceSchema, CompanyInSchema

AuditScope = Literal["one", "all", "selected"]
AuditStage = Literal["planning", "documents", "onsite", "report"]
HazardClass = Literal["I", "II", "III", "IV"]
HazardSign = Literal["substances", "pressure", "lifting", "melts", "mining", "grain"]
AuditKind = Literal["basic", "interim", "selective", "consultation"]
AuditElement = Literal[
    "identification",
    "documentation",
    "production_control",
    "documents_compliance",
    "risk_measures",
    "incidents",
    "emergency",
    "insurance",
    "personnel",
    "contractors",
    "work_conditions",
    "equipment",
    "declaration",
    "justification",
    "intrusion",
    "instruments",
    "resources",
    "other",
]
TimingKind = Literal["custom", "month", "this_quarter", "next_quarter", "studying"]
BudgetMode = Literal["custom", "none"]
Negotiation = Literal["yes", "no", "on_scope"]
OfferAnswer = Literal["accept", "counter", "decline"]

MIN_PRICE_MESSAGE = "Стоимость аудита — не менее 100 000 ₽"


class AuditApplicantSchema(BaseModel):
    """Представитель заказчика. by_proxy — действует по доверенности, её нужно приложить."""

    full_name: str = Field(..., min_length=3, max_length=255, description="ФИО представителя")
    position: str = Field(..., min_length=2, max_length=255, description="Должность")
    organization: str = Field(..., min_length=2, max_length=500, description="Организация")
    inn: str = Field(..., pattern=r"^\d{10}(\d{2})?$", description="ИНН организации")
    phone: str = Field(..., min_length=10, max_length=32, description="Телефон")
    email: EmailStr = Field(..., description="Корпоративная почта")
    by_proxy: bool = Field(False, description="Действует по доверенности")


class AuditObjectSchema(BaseModel):
    """Опасный производственный объект, который проверяется."""

    reg_number: str = Field(..., min_length=1, max_length=64, description="Регистрационный номер ОПО")
    name: str = Field(..., min_length=2, max_length=500, description="Наименование ОПО")
    hazard_class: HazardClass = Field(..., description="Класс опасности")
    address: str = Field(..., min_length=5, max_length=500, description="Адрес ОПО")
    industry: str = Field(..., min_length=2, max_length=500, description="Отрасль и вид деятельности")
    hazard_signs: list[HazardSign] = Field(..., min_length=1, description="Признаки опасности")


class AuditFleetSchema(BaseModel):
    """Все ОПО организации, когда аудит по всем объектам."""

    count: int = Field(..., ge=1, le=10000, description="Сколько ОПО")
    profile: str = Field(..., min_length=2, max_length=500, description="Отраслевой профиль")
    multi_region: bool = Field(..., description="Есть ОПО в разных субъектах РФ")


class AuditParamsSchema(BaseModel):
    """Тип аудита и уточнения к нему: СТО организации или элементы СУПБ."""

    kind: AuditKind = Field(..., description="Тип аудита")
    use_sto: bool | None = Field(None, description="Учитывать СТО: для базового и промежуточного")
    sto_name: str | None = Field(None, max_length=1000, description="Наименование и реквизиты СТО")
    elements: list[AuditElement] = Field(default_factory=list, description="Элементы для выборочного")

    @model_validator(mode="after")
    def match_kind(self) -> Self:
        """Под тип аудита — свои уточнения."""

        if self.kind in ("basic", "interim") and self.use_sto is None:
            raise ValueError("Укажите, учитывать ли внутренние стандарты организации")

        if self.use_sto and not (self.sto_name or "").strip():
            raise ValueError("Укажите наименование и реквизиты СТО")

        if self.kind == "selective" and not self.elements:
            raise ValueError("Выберите хотя бы одно направление для аудита")

        return self


class AuditTimingSchema(BaseModel):
    """Желаемые сроки. Свой срок — период с… по…"""

    kind: TimingKind
    start: date | None = None
    end: date | None = None

    @model_validator(mode="after")
    def require_period(self) -> Self:
        """Свой срок задаётся периодом, начало не позже конца."""

        if self.kind != "custom":
            return self

        if self.start is None or self.end is None:
            raise ValueError("Укажите период проведения аудита")

        if self.start > self.end:
            raise ValueError("Начало периода позже его окончания")

        return self


class AuditBudgetSchema(BaseModel):
    """Бюджет и готовность обсуждать стоимость."""

    mode: BudgetMode = Field(..., description="custom — своя сумма, none — не установлен")
    negotiation: Negotiation = Field(..., description="Можно ли обсуждать стоимость")


class AuditDetailsSchema(BaseModel):
    """Анкета аудита. one — один ОПО в objects, selected — несколько, all — сведения в fleet."""

    applicant: AuditApplicantSchema
    scope: AuditScope
    objects: list[AuditObjectSchema] = Field(default_factory=list, max_length=200)
    fleet: AuditFleetSchema | None = None
    stages: list[AuditStage] = Field(..., min_length=1)
    params: AuditParamsSchema
    timing: AuditTimingSchema
    budget: AuditBudgetSchema

    @model_validator(mode="after")
    def match_scope(self) -> Self:
        """Под каждый масштаб — свои сведения об объектах."""

        if self.scope == "one" and len(self.objects) != 1:
            raise ValueError("Укажите сведения об ОПО")

        if self.scope == "selected" and not self.objects:
            raise ValueError("Добавьте хотя бы один ОПО")

        if self.scope == "all" and self.fleet is None:
            raise ValueError("Укажите сведения об ОПО организации")

        return self


class AuditCreateSchema(BaseModel):
    """Заявка на аудит: анкета, цена или «бюджет не установлен», реквизиты организации."""

    details: AuditDetailsSchema
    price: Decimal | None = Field(None, le=MAX_PRICE, decimal_places=2, description="Цена заказчика")
    customer_type: CustomerType = Field(CustomerType.LEGAL, description="Организация или ИП")
    company: CompanyInSchema
    comment: str | None = Field(None, max_length=4000, description="Комментарий")

    @model_validator(mode="after")
    def check_customer_and_price(self) -> Self:
        """Аудит заказывает организация или ИП, своя цена — не ниже минимальной."""

        if self.customer_type not in COMPANY_CUSTOMERS:
            raise ValueError("Аудит заказывает организация или индивидуальный предприниматель")

        custom = self.details.budget.mode == "custom"

        if custom and self.price is None:
            raise ValueError("Укажите сумму")

        if not custom and self.price is not None:
            raise ValueError("Бюджет не установлен: сумму не указывают")

        if self.price is not None and self.price < MIN_AUDIT_PRICE:
            raise ValueError(MIN_PRICE_MESSAGE)

        return self


class AuditPriceSchema(BaseModel):
    """Цена, которую предлагает руководитель группы."""

    price: Decimal = Field(..., ge=MIN_AUDIT_PRICE, le=MAX_PRICE, decimal_places=2)


class OfferAnswerSchema(BaseModel):
    """Ответ заказчика на цену: принять, предложить свою ниже или отказаться."""

    answer: OfferAnswer
    price: Decimal | None = Field(None, ge=MIN_AUDIT_PRICE, le=MAX_PRICE, decimal_places=2)

    @model_validator(mode="after")
    def require_counter_price(self) -> Self:
        """Своя цена обязательна, когда заказчик её предлагает."""

        if self.answer == "counter" and self.price is None:
            raise ValueError("Укажите свою цену")

        return self


class CounterAnswerSchema(BaseModel):
    """Ответ руководителя группы на цену заказчика."""

    accept: bool


class TeamSchema(BaseModel):
    """Аудиторы, которых руководитель включает в группу."""

    account_ids: list[int] = Field(default_factory=list, max_length=20)


class PlanInSchema(BaseModel):
    """Что руководитель группы заполняет в Плане аудита."""

    documents_start: date
    documents_end: date
    onsite_start: date | None = None
    onsite_end: date | None = None
    meetings: bool = Field(True, description="Вступительное и заключительное совещания")
    opening_at: datetime | None = None
    closing_at: datetime | None = None
    meeting_link: str | None = Field(None, max_length=500, description="Ссылка на видеосвязь")
    workshops: str | None = Field(None, max_length=2000, description="Цеха и участки для выезда")
    interviewees: str = Field(..., min_length=2, max_length=2000, description="Кого интервьюировать")

    @model_validator(mode="after")
    def check_schedule(self) -> Self:
        """Периоды идут по порядку, у совещаний есть время."""

        if self.documents_start > self.documents_end:
            raise ValueError("Начало документарного этапа позже его окончания")

        if (self.onsite_start is None) != (self.onsite_end is None):
            raise ValueError("Укажите обе даты выездного этапа")

        if self.onsite_start and self.onsite_end and self.onsite_start > self.onsite_end:
            raise ValueError("Начало выездного этапа позже его окончания")

        if self.meetings and (self.opening_at is None or self.closing_at is None):
            raise ValueError("Укажите время вступительного и заключительного совещаний")

        return self


class PlanSchema(PlanInSchema):
    """Сохранённый План: версия растёт с каждой отправкой."""

    version: int = 1


class PlanChangesSchema(BaseModel):
    """Просьба заказчика поправить План."""

    comment: str = Field(..., min_length=3, max_length=4000)


class LeadSchema(BaseModel):
    """Назначить аудитора руководителем группы или снять с этой роли."""

    lead: bool


class ChecklistItemSchema(BaseModel):
    """Пункт перечня документов."""

    number: int
    title: str


class AuditCatalogSchema(BaseModel):
    """Справочники анкеты аудита и перечень документов."""

    min_price: int
    tariff: int | None
    scopes: list[ChoiceSchema]
    hazard_classes: list[str]
    hazard_signs: list[ChoiceSchema]
    stages: list[ChoiceSchema]
    kinds: list[ChoiceSchema]
    elements: list[ChoiceSchema]
    timings: list[ChoiceSchema]
    budgets: list[ChoiceSchema]
    negotiations: list[ChoiceSchema]
    checklist: list[ChecklistItemSchema]

    @classmethod
    def build(cls, checklist: tuple[str, ...], tariff: Decimal | None) -> Self:
        """Справочники из констант, тариф из админки и перечень по порядку."""

        return cls(
            min_price=int(MIN_AUDIT_PRICE),
            tariff=int(tariff) if tariff is not None else None,
            scopes=choices(SCOPES),
            hazard_classes=list(HAZARD_CLASSES),
            hazard_signs=choices(HAZARD_SIGNS),
            stages=choices(STAGES),
            kinds=choices(AUDIT_KINDS),
            elements=choices(ELEMENTS),
            timings=choices(TIMINGS),
            budgets=choices(BUDGETS),
            negotiations=choices(NEGOTIATIONS),
            checklist=[
                ChecklistItemSchema(number=number, title=title)
                for number, title in enumerate(checklist, start=1)
            ],
        )


def choices(labels: dict[str, str]) -> list[ChoiceSchema]:
    """Варианты выбора из словаря «код: подпись»."""

    return [ChoiceSchema(code=code, title=title) for code, title in labels.items()]
