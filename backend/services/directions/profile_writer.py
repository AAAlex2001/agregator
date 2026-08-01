"""Общая механика записи анкеты направления в профиль роли.

Одна на два входа: сохранение анкеты из кабинета и заполнение при регистрации.
Коды ответа у них разные, поэтому исключение валидации сюда не заворачивается —
его переводит в HTTP вызывающий слой.
"""
from typing import Any

from models.base import Base
from services.directions.registry import RoleForm


def clean_payload(form: RoleForm, payload: dict[str, Any]) -> dict[str, Any]:
    """Проверяет поля анкеты схемой направления и убирает документы.

    Документы кладёт только загрузка файла: иначе через тело запроса можно было бы
    записать в анкету ссылку на чужой файл.
    """
    data = form.input_schema.model_validate(payload).model_dump()
    data.pop("documents", None)
    return data


def write(profile: Base, form: RoleForm, data: dict[str, Any]) -> Base:
    """Пишет поля анкеты и возвращает сущность, в которой они лежат.

    Для направлений с owner_attribute="" это сам профиль роли, иначе — отдельная анкета,
    при необходимости созданная.
    """
    if not form.is_separate_table:
        apply(profile, data)
        return profile

    target = getattr(profile, form.owner_attribute)
    if target is None:
        target = form.model(**data)
        if form.supports_documents:
            target.documents = []
        setattr(profile, form.owner_attribute, target)
        return target

    apply(target, data)
    return target


def apply(target: object, data: dict[str, Any]) -> None:
    "Переносит значения схемы в поля модели."
    for field, value in data.items():
        setattr(target, field, value)
