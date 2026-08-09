"""Сборка деталей заявки по направлению.

Обычное направление — одна строка деталей, она собирается из полей схемы напрямую.
Аудит — единственное направление с дочерними строками: список ОПО хранится
отдельной таблицей, поэтому его сущности строятся здесь явно.
"""
from pydantic import BaseModel

from models.audit import OrderAuditDetails, OrderAuditOpoItem
from models.base import Base
from models.cadastral import OrderCadastralDetails
from models.forensic import OrderForensicDetails
from models.laboratory import OrderLaboratoryDetails
from models.research import OrderResearchDetails
from models.tech_diag import OrderTechDiagDetails
from schemas.audit import AuditOrderDetailsInput
from services.directions.registry import Direction

OrderDirectionDetails = (
    OrderAuditDetails
    | OrderCadastralDetails
    | OrderForensicDetails
    | OrderLaboratoryDetails
    | OrderResearchDetails
    | OrderTechDiagDetails
)


def build_details(direction: Direction, validated: BaseModel) -> OrderDirectionDetails:
    """Создаёт детали заявки; конкретный класс задаёт реестр направлений."""
    if isinstance(validated, AuditOrderDetailsInput):
        return build_audit_details(validated)
    return direction.details_model(**validated.model_dump())


def apply_details(current: Base, validated: BaseModel) -> None:
    """Переписывает существующие детали заявки полями из схемы."""
    if isinstance(current, OrderAuditDetails) and isinstance(validated, AuditOrderDetailsInput):
        apply_audit_details(current, validated)
        return
    for name, value in validated.model_dump().items():
        setattr(current, name, value)


def build_audit_details(validated: AuditOrderDetailsInput) -> OrderAuditDetails:
    """Собирает детали аудита вместе со строками ОПО."""
    details = OrderAuditDetails(**validated.model_dump(exclude={"opo_items"}))
    details.opo_items = build_opo_items(validated)
    return details


def apply_audit_details(current: OrderAuditDetails, validated: AuditOrderDetailsInput) -> None:
    """Обновляет детали аудита; прежние строки ОПО заменяются новыми."""
    for name, value in validated.model_dump(exclude={"opo_items"}).items():
        setattr(current, name, value)
    current.opo_items = build_opo_items(validated)


def build_opo_items(validated: AuditOrderDetailsInput) -> list[OrderAuditOpoItem]:
    """Строит строки ОПО, сохраняя порядок из формы."""
    return [
        OrderAuditOpoItem(position=index, **item.model_dump())
        for index, item in enumerate(validated.opo_items)
    ]
