"""Реестр направлений — единственное место, где описано, какие направления есть.

У направления две независимые части, обе опциональны:
- анкеты по ролям: что заполняет заказчик, исполнитель и держатель документов;
- поля заявки: чем дополняется заказ этого направления.

Новое направление = модели + схемы + одна запись здесь.
"""
from dataclasses import dataclass, field
from typing import Any

from pydantic import BaseModel

from models.account import UserRole
from models.base import Base
from models.direction_profile import (
    CustomerAuditProfile,
    ExpertAuditProfile,
    ExpertCadastralProfile,
    ExpertForensicProfile,
)
from models.expert import Expert
from models.license_holder import LicenseHolder
from models.order import OrderWorkType
from models.order_details import (
    OrderCadastralDetails,
    OrderForensicDetails,
    OrderLaboratoryDetails,
    OrderResearchDetails,
)
from schemas.directions import (
    AuditProfileInput,
    AuditProfileResponse,
    CadastralOrderDetailsInput,
    CadastralOrderDetailsResponse,
    CadastralProfileInput,
    CadastralProfileResponse,
    CustomerAuditProfileInput,
    CustomerAuditProfileResponse,
    ExpertiseExpertProfileInput,
    ExpertiseExpertProfileResponse,
    ExpertiseLicenseHolderProfileInput,
    ExpertiseLicenseHolderProfileResponse,
    ForensicOrderDetailsInput,
    ForensicOrderDetailsResponse,
    ForensicProfileInput,
    ForensicProfileResponse,
    LaboratoryOrderDetailsInput,
    LaboratoryOrderDetailsResponse,
    ResearchOrderDetailsInput,
    ResearchOrderDetailsResponse,
)


@dataclass(frozen=True)
class RoleForm:
    """Анкета одной роли в одном направлении.

    owner_attribute — путь от профиля роли к анкете. Пустая строка означает, что
    поля направления живут в самом профиле роли (так устроена экспертиза ОПО).
    """
    model: type[Base]
    owner_attribute: str
    input_schema: type[BaseModel]
    response_schema: type[BaseModel]

    @property
    def is_separate_table(self) -> bool:
        "Хранится ли анкета отдельной таблицей, а не полями профиля роли."
        return bool(self.owner_attribute)

    @property
    def supports_documents(self) -> bool:
        "Можно ли прикладывать к анкете документы — выводится из её схемы, отдельного флага нет."
        return "documents" in self.input_schema.model_fields

    def save(self, profile: Base, payload: dict[str, Any]) -> Base:
        """Проверяет поля анкеты своей схемой и записывает их в профиль роли.

        payload — сырое тело запроса: его форма зависит от направления, поэтому
        конкретной схемой он типизирован быть не может, её выбирает сам реестр.
        Возвращает ORM-модель, в которой поля осели: для направлений с
        owner_attribute="" это сам профиль роли, иначе — отдельная анкета,
        при необходимости созданная. Конкретный класс тоже зависит от направления.

        Документы из payload выбрасываются: их кладёт только загрузка файла, иначе
        через тело запроса можно было бы записать в анкету ссылку на чужой файл.
        ValidationError наружу не перехватывается — код ответа выбирает вызывающий
        слой: 422 в кабинете, 400 при регистрации.
        """
        data = self.input_schema.model_validate(payload).model_dump()
        data.pop("documents", None)

        target = getattr(profile, self.owner_attribute) if self.is_separate_table else profile
        if target is None:
            target = self.model(**data)
            if self.supports_documents:
                target.documents = []
            setattr(profile, self.owner_attribute, target)
            return target

        for name, value in data.items():
            setattr(target, name, value)
        return target


@dataclass(frozen=True)
class Direction:
    "Направление: анкеты по ролям и дополнительные поля заявки."
    key: str
    title: str
    role_forms: dict[UserRole, RoleForm] = field(default_factory=dict)
    details_model: type[Base] | None = None
    details_attribute: str | None = None
    details_input_schema: type[BaseModel] | None = None
    details_response_schema: type[BaseModel] | None = None

    @property
    def has_details(self) -> bool:
        "Есть ли у направления дополнительные поля заявки."
        return self.details_model is not None

    @property
    def roles(self) -> tuple[UserRole, ...]:
        "Роли, которым доступно направление."
        return tuple(self.role_forms)

    def form_for(self, role: UserRole) -> RoleForm | None:
        "Анкета роли в этом направлении или None, если роли направление недоступно."
        return self.role_forms.get(role)


DIRECTIONS: tuple[Direction, ...] = (
    Direction(
        key=OrderWorkType.EXPERTISE.value,
        title="Экспертиза промышленной безопасности",
        role_forms={
            UserRole.EXPERT: RoleForm(
                model=Expert,
                owner_attribute="",
                input_schema=ExpertiseExpertProfileInput,
                response_schema=ExpertiseExpertProfileResponse,
            ),
            UserRole.LICENSE_HOLDER: RoleForm(
                model=LicenseHolder,
                owner_attribute="",
                input_schema=ExpertiseLicenseHolderProfileInput,
                response_schema=ExpertiseLicenseHolderProfileResponse,
            ),
        },
    ),
    Direction(
        key=OrderWorkType.AUDIT_SUPB.value,
        title="Аудит СУПБ",
        role_forms={
            UserRole.CUSTOMER: RoleForm(
                model=CustomerAuditProfile,
                owner_attribute="audit_profile",
                input_schema=CustomerAuditProfileInput,
                response_schema=CustomerAuditProfileResponse,
            ),
            UserRole.EXPERT: RoleForm(
                model=ExpertAuditProfile,
                owner_attribute="audit_profile",
                input_schema=AuditProfileInput,
                response_schema=AuditProfileResponse,
            ),
        },
    ),
    Direction(
        key=OrderWorkType.CADASTRAL.value,
        title="Кадастровые работы",
        role_forms={
            UserRole.EXPERT: RoleForm(
                model=ExpertCadastralProfile,
                owner_attribute="cadastral_profile",
                input_schema=CadastralProfileInput,
                response_schema=CadastralProfileResponse,
            ),
        },
        details_model=OrderCadastralDetails,
        details_attribute="cadastral_details",
        details_input_schema=CadastralOrderDetailsInput,
        details_response_schema=CadastralOrderDetailsResponse,
    ),
    Direction(
        key=OrderWorkType.FORENSIC.value,
        title="Судебная экспертиза",
        role_forms={
            UserRole.EXPERT: RoleForm(
                model=ExpertForensicProfile,
                owner_attribute="forensic_profile",
                input_schema=ForensicProfileInput,
                response_schema=ForensicProfileResponse,
            ),
        },
        details_model=OrderForensicDetails,
        details_attribute="forensic_details",
        details_input_schema=ForensicOrderDetailsInput,
        details_response_schema=ForensicOrderDetailsResponse,
    ),
    Direction(
        key=OrderWorkType.RESEARCH.value,
        title="Научно-исследовательские работы",
        details_model=OrderResearchDetails,
        details_attribute="research_details",
        details_input_schema=ResearchOrderDetailsInput,
        details_response_schema=ResearchOrderDetailsResponse,
    ),
    Direction(
        key=OrderWorkType.LABORATORY.value,
        title="Лабораторные исследования",
        details_model=OrderLaboratoryDetails,
        details_attribute="laboratory_details",
        details_input_schema=LaboratoryOrderDetailsInput,
        details_response_schema=LaboratoryOrderDetailsResponse,
    ),
)

DIRECTIONS_BY_KEY: dict[str, Direction] = {direction.key: direction for direction in DIRECTIONS}


def get_direction(key: str) -> Direction | None:
    "Возвращает направление по ключу (значению OrderWorkType) или None."
    return DIRECTIONS_BY_KEY.get(key)


def directions_for_role(role: UserRole) -> tuple[Direction, ...]:
    "Направления, у которых есть анкета для этой роли."
    return tuple(direction for direction in DIRECTIONS if direction.form_for(role) is not None)
