"""Заявки Блиц-эксперта в запросах и ответах API."""

from datetime import date, datetime
from decimal import Decimal
from typing import Any, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.blitz.billing.schemas import InvoiceSchema
from app.blitz.catalog import AREAS, CONTRACT_TITLES, DEADLINE_TITLES, OBJECTS, ContractKind, Deadline
from app.blitz.orders.models import COMPANY_CUSTOMERS, CustomerType, OrderStatus
from app.core.money import Money

MAX_PRICE = Decimal("99999999")


class CompanyInSchema(BaseModel):
    """Реквизиты организации или ИП для договора, счёта и акта."""

    full_name: str = Field(..., min_length=3, max_length=500, description="Полное наименование")
    name: str = Field(..., min_length=2, max_length=255, description="Краткое наименование")
    inn: str = Field(..., max_length=20, description="ИНН")
    kpp: str | None = Field(None, max_length=20, description="КПП, у ИП нет")
    ogrn: str = Field(..., max_length=20, description="ОГРН или ОГРНИП")
    address: str = Field(..., min_length=5, max_length=500, description="Юридический адрес")
    bank: str = Field(..., min_length=2, max_length=255, description="Банк")
    bic: str = Field(..., max_length=20, description="БИК")
    account: str = Field(..., max_length=30, description="Расчётный счёт")
    corr_account: str = Field(..., max_length=30, description="Корреспондентский счёт")
    signer_position: str = Field(..., min_length=2, max_length=255, description="Должность подписанта")
    signer_name: str = Field(..., min_length=3, max_length=255, description="ФИО подписанта")
    signer_genitive: str = Field(
        ...,
        min_length=3,
        max_length=500,
        description="Должность и ФИО в родительном падеже: «директора Иванова Ивана Ивановича»",
    )
    signer_basis: str = Field(..., min_length=3, max_length=255, description="Основание: «Устава»")


class IndividualInSchema(BaseModel):
    """Паспортные данные физлица для договора и акта."""

    full_name: str = Field(..., min_length=3, max_length=255, description="ФИО")
    passport_number: str = Field(..., max_length=20, description="Серия и номер")
    passport_issued_by: str = Field(..., min_length=3, max_length=500, description="Кем выдан")
    passport_issued_at: date = Field(..., description="Когда выдан")
    address: str = Field(..., min_length=5, max_length=500, description="Адрес регистрации")


class OrderCreateSchema(BaseModel):
    """Новая заявка. Объект, область и требования к эксперту можно не указывать."""

    object_code: str | None = Field(None, max_length=8, description="Объект экспертизы: «КЛ/ТП»")
    area_code: str | None = Field(None, max_length=8, description="Область аттестации: «Э12»")
    hazard_class: int | None = Field(None, ge=1, le=4, description="Класс опасности ОПО")
    expert_category: int | None = Field(None, ge=1, le=3, description="Категория эксперта")
    deadline: Deadline = Field(Deadline.ANY, description="Желаемый срок")
    object_name: str = Field(..., min_length=3, max_length=500, description="Наименование документации")
    contract_kind: ContractKind | None = Field(None, description="Вид договора, если известен")
    price: Decimal = Field(..., gt=0, le=MAX_PRICE, decimal_places=2, description="Цена заказчика, ₽")
    customer_type: CustomerType = Field(..., description="Организация, ИП или физлицо")
    company: CompanyInSchema | None = Field(None, description="Реквизиты организации или ИП")
    individual: IndividualInSchema | None = Field(None, description="Данные физлица")
    comment: str | None = Field(None, max_length=4000, description="Комментарий")

    @model_validator(mode="after")
    def check_customer(self) -> Self:
        """Организации и ИП нужны реквизиты, физлицу — паспорт."""

        if self.customer_type in COMPANY_CUSTOMERS and self.company is None:
            raise ValueError("Заполните реквизиты организации")

        if self.customer_type == CustomerType.INDIVIDUAL and self.individual is None:
            raise ValueError("Заполните паспортные данные")

        return self


class CompanySchema(CompanyInSchema):
    """Реквизиты заказчика в заявке."""

    model_config = ConfigDict(from_attributes=True)


class IndividualSchema(IndividualInSchema):
    """Данные физлица в заявке."""

    model_config = ConfigDict(from_attributes=True)


class RequisitesSchema(BaseModel):
    """Реквизиты из последней заявки: подставляются в новую."""

    customer_type: CustomerType | None = None
    company: CompanySchema | None = None
    individual: IndividualSchema | None = None


class DocumentSchema(BaseModel):
    """Файл заявки."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    kind: str
    name: str
    size: int
    remark_id: int | None
    item_number: int | None
    created_at: datetime


class RemarkSchema(BaseModel):
    """Раунд замечаний: текст эксперта, ответ заказчика и файлы обоих."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str | None
    response_text: str | None
    created_at: datetime
    resolved_at: datetime | None
    documents: list[DocumentSchema]


class StatusChangeSchema(BaseModel):
    """Шаг истории статусов."""

    model_config = ConfigDict(from_attributes=True)

    status: OrderStatus
    actor: str
    note: str | None
    created_at: datetime


class PriceChangeSchema(BaseModel):
    """Смена цены администратором."""

    model_config = ConfigDict(from_attributes=True)

    old_price: Money | None
    new_price: Money
    reason: str
    created_at: datetime


class OrderSummarySchema(BaseModel):
    """Заявка в списке."""

    id: int
    service: str
    status: OrderStatus
    object_name: str
    object_code: str | None
    area_code: str | None
    deadline: str
    price: Money | None
    customer_type: CustomerType
    expert_name: str | None
    created_at: datetime
    updated_at: datetime


class TeamMemberSchema(BaseModel):
    """Аудитор группы: имя, области аттестации и руководитель ли он."""

    id: int
    name: str
    areas: list[str]
    lead: bool


class OrderSchema(OrderSummarySchema):
    """Заявка целиком. Реквизиты и оплату видят только заказчик и назначенный эксперт.

    У аудита ещё анкета, предложения цены, План и группа аудиторов.
    """

    hazard_class: int | None
    expert_category: int | None
    contract_kind: str | None
    comment: str | None
    result: str | None
    cancel_reason: str | None
    customer_name: str
    paid_amount: Money
    stage: str | None
    amount_due: Money | None
    company: CompanySchema | None
    individual: IndividualSchema | None
    documents: list[DocumentSchema]
    remarks: list[RemarkSchema]
    history: list[StatusChangeSchema]
    price_changes: list[PriceChangeSchema]
    invoices: list[InvoiceSchema]
    offer_price: Money | None
    counter_price: Money | None
    audit_details: dict[str, Any] | None
    audit_plan: dict[str, Any] | None
    plan_comment: str | None
    team: list[TeamMemberSchema]


class OrderPageSchema(BaseModel):
    """Страница заявок для админки."""

    items: list[OrderSchema]
    total: int


class AcceptOrderSchema(BaseModel):
    """Эксперт берёт заявку и, если заказчик не знал, выбирает вид договора."""

    contract_kind: ContractKind | None = Field(None, description="Вид договора")


class CancelOrderSchema(BaseModel):
    """Отмена заявки с причиной."""

    reason: str = Field(..., min_length=3, max_length=1000, description="Причина отмены")


class SetStatusSchema(BaseModel):
    """Статус, который ставит администратор, и пояснение для истории."""

    status: OrderStatus = Field(..., description="Новый статус")
    note: str | None = Field(None, max_length=1000, description="Пояснение для сторон")


class AssignExpertSchema(BaseModel):
    """Эксперт, которого назначает администратор."""

    expert_id: int = Field(..., ge=1, description="ID аккаунта эксперта")
    contract_kind: ContractKind | None = Field(None, description="Вид договора, если не определён")


class ExpertOptionSchema(BaseModel):
    """Эксперт в списке для назначения."""

    id: int
    name: str
    fits: bool = Field(..., description="Удостоверения подходят под заявку")


class ChoiceSchema(BaseModel):
    """Вариант выбора: код и название."""

    code: str
    title: str


class AreaSchema(ChoiceSchema):
    """Область аттестации и её объекты."""

    objects: list[str]


class ObjectSchema(ChoiceSchema):
    """Объект экспертизы и подходящие виды договора."""

    description: str
    kinds: list[str]


class CatalogSchema(BaseModel):
    """Справочник для формы заявки и фильтров."""

    areas: list[AreaSchema]
    objects: list[ObjectSchema]
    kinds: list[ChoiceSchema]
    deadlines: list[ChoiceSchema]

    @classmethod
    def build(cls) -> Self:
        """Справочник из каталога."""

        return cls(
            areas=[
                AreaSchema(code=area.code, title=area.title, objects=list(area.objects))
                for area in AREAS
            ],
            objects=[
                ObjectSchema(
                    code=item.code,
                    title=item.title,
                    description=item.description,
                    kinds=[str(kind) for kind in item.kinds],
                )
                for item in OBJECTS
            ],
            kinds=[ChoiceSchema(code=kind, title=title) for kind, title in CONTRACT_TITLES.items()],
            deadlines=[ChoiceSchema(code=key, title=title) for key, title in DEADLINE_TITLES.items()],
        )
