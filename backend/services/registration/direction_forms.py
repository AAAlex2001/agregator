"""Заполнение анкет направлений при регистрации.

Регистрация не знает, какие направления существуют и какие у них поля —
это знает реестр. Здесь только маршрутизация: направление → его анкета.
"""
from typing import Any

from fastapi import HTTPException, status
from pydantic import ValidationError

from models.account import Account
from models.base import Base
from schemas.registration import DirectionRegistration
from services.directions.registry import RoleForm, get_direction


def role_profile(account: Account) -> Base | None:
    "Профиль роли аккаунта: заказчик, исполнитель или держатель документов."
    return account.customer_profile or account.expert_profile or account.license_holder_profile


def require_form(account: Account, key: str) -> RoleForm:
    "Возвращает анкету направления для роли аккаунта или бросает 400."
    direction = get_direction(key)
    if direction is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Неизвестное направление: {key}",
        )
    form = direction.form_for(account.role)
    if form is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Направление «{direction.title}» недоступно для выбранной роли",
        )
    return form


def build_profiles(account: Account, directions: list[DirectionRegistration]) -> list[Base]:
    """Создаёт анкеты выбранных направлений.

    Поля направления, живущие в самом профиле роли (экспертиза ОПО), пишутся в него,
    остальные — отдельными сущностями. Возвращает то, что нужно добавить в сессию.
    """
    profile = role_profile(account)
    if profile is None:
        return []

    created: list[Base] = []
    for item in directions:
        form = require_form(account, item.key)
        data = validate(form, item.data, item.key)
        if not form.is_separate_table:
            apply(profile, data)
            continue
        entity = form.model(**data)
        setattr(profile, form.owner_attribute, entity)
        created.append(entity)
    return created


def validate(form: RoleForm, payload: dict[str, Any], key: str) -> dict[str, Any]:
    "Проверяет поля анкеты схемой направления; ошибки отдаются как 400 с понятным текстом."
    try:
        return form.input_schema.model_validate(payload).model_dump(mode="json")
    except ValidationError as error:
        message = error.errors()[0].get("msg", "некорректные поля")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Направление {key}: {message}",
        ) from error


def apply(target: object, data: dict[str, Any]) -> None:
    "Переносит значения схемы в поля модели."
    for field, value in data.items():
        setattr(target, field, value)
