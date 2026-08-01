"""Заполнение анкет направлений при регистрации.

Регистрация не знает, какие направления существуют и какие у них поля — это знает
реестр. Механика записи общая с кабинетом (services/directions/profile_writer),
здесь отличаются только коды ответа: у регистрации это 400.
"""
from typing import Any

from fastapi import HTTPException, status
from pydantic import ValidationError

from models.account import Account
from models.base import Base
from schemas.registration import DirectionRegistration
from services.directions.profile_writer import clean_payload, write
from services.directions.registry import RoleForm, get_direction
from services.directions.validators import DirectionsValidator


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

    Возвращает анкеты, которые лежат отдельными таблицами и которые надо добавить
    в сессию; поля, живущие в самом профиле роли, уже записаны в него.
    """
    profile = DirectionsValidator.role_profile(account)
    if profile is None:
        return []

    created: list[Base] = []
    for item in directions:
        form = require_form(account, item.key)
        target = write(profile, form, validate(form, item.data, item.key))
        if form.is_separate_table:
            created.append(target)
    return created


def validate(form: RoleForm, payload: dict[str, Any], key: str) -> dict[str, Any]:
    "Проверяет поля анкеты схемой направления; ошибки отдаются как 400 с понятным текстом."
    try:
        return clean_payload(form, payload)
    except ValidationError as error:
        message = error.errors()[0].get("msg", "некорректные поля")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Направление {key}: {message}",
        ) from error
