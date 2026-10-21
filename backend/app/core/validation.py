"""Ошибки проверки запроса по-русски: что не так с полем и где оно. Введённые данные не возвращаются."""

from typing import Any

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

DEFAULT_MESSAGE = "Неверное значение"

MESSAGES = {
    "missing": "Обязательное поле",
    "string_too_short": "Слишком коротко: не меньше {min_length} символов",
    "string_too_long": "Слишком длинно: не больше {max_length} символов",
    "too_short": "Добавьте хотя бы {min_length}",
    "too_long": "Не больше {max_length}",
    "string_pattern_mismatch": "Неверный формат",
    "greater_than": "Должно быть больше {gt}",
    "greater_than_equal": "Не меньше {ge}",
    "less_than": "Должно быть меньше {lt}",
    "less_than_equal": "Не больше {le}",
    "decimal_max_places": "Не больше {decimal_places} знаков после запятой",
    "decimal_max_digits": "Слишком большое число",
    "int_parsing": "Нужно целое число",
    "int_from_float": "Нужно целое число",
    "decimal_parsing": "Нужно число",
    "float_parsing": "Нужно число",
    "date_parsing": "Нужна дата",
    "date_from_datetime_parsing": "Нужна дата",
    "datetime_parsing": "Нужны дата и время",
    "datetime_from_date_parsing": "Нужны дата и время",
    "bool_parsing": "Нужно «да» или «нет»",
    "enum": "Выберите значение из списка",
    "literal_error": "Выберите значение из списка",
    "url_parsing": "Неверная ссылка",
    "json_invalid": "Данные формы повреждены — обновите страницу и попробуйте ещё раз",
}


def translate(error: dict[str, Any]) -> str:
    """Текст ошибки по её типу. Свои ValueError схем уже по-русски и отдаются как есть."""

    context = error.get("ctx") or {}

    if error["type"] == "value_error":
        reason = str(context.get("error", ""))
        return "Неверный адрес почты" if "email" in reason.lower() else reason or DEFAULT_MESSAGE

    template = MESSAGES.get(error["type"], DEFAULT_MESSAGE)

    try:
        return template.format(**context)
    except (KeyError, IndexError):
        return DEFAULT_MESSAGE


async def validation_error_handler(request: Request, error: RequestValidationError) -> JSONResponse:
    """Ошибки проверки: путь к полю, тип и понятный текст. FastAPI передаёт и запрос."""

    detail = [
        {"loc": list(item["loc"]), "type": item["type"], "msg": translate(item)}
        for item in error.errors()
    ]

    return JSONResponse({"detail": detail}, status_code=422)
