"""Заполнение анкет направлений при регистрации.

Регистрация не знает, какие направления существуют и какие у них поля — это знает
реестр, он же умеет записать анкету в профиль роли. Здесь только маршрутизация
и свой код ответа: у регистрации это 400.
"""
from fastapi import HTTPException, UploadFile, status
from pydantic import ValidationError

from models.account import Account
from models.base import Base
from schemas.registration import DirectionRegistration
from services.directions.registry import RoleForm, get_direction
from services.directions.use_cases.upload_direction_document import (
    UploadDirectionDocumentUseCase,
)
from services.directions.validators import DirectionsValidator

MAX_REGISTRATION_DOCUMENTS = 20


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
        try:
            target = form.save(profile, item.data)
        except ValidationError as error:
            message = error.errors()[0].get("msg", "некорректные поля")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Направление {item.key}: {message}",
            ) from error

        if form.is_separate_table:
            created.append(target)
    return created


async def attach_documents(
    use_case: UploadDirectionDocumentUseCase,
    account_id: int,
    keys: list[str],
    files: list[UploadFile],
) -> None:
    """Кладёт приложенные при регистрации дипломы и аттестаты в анкеты своих направлений.

    Ключ направления и файл приходят параллельными списками одной формы, поэтому их
    длины обязаны совпадать. Сохраняет тот же use case, что и загрузка из кабинета:
    проверка типа, размера и владельца файла одна на оба сценария.
    """
    if len(keys) != len(files):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Каждому документу должно соответствовать направление",
        )
    if len(files) > MAX_REGISTRATION_DOCUMENTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"При регистрации можно приложить не более {MAX_REGISTRATION_DOCUMENTS} документов",
        )
    for key, file in zip(keys, files, strict=True):
        await use_case.execute(account_id, key, file)
