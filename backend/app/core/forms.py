"""JSON-поле multipart-формы: данные заявки приходят строкой рядом с файлами."""

from collections.abc import Callable

from fastapi import Form
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, ValidationError


def json_form[Model: BaseModel](schema: type[Model]) -> Callable[[str], Model]:
    """Зависимость: поле payload формы как схема. Ошибки — с путём body.payload.<поле>."""

    def parse(payload: str = Form(..., description="Данные формы в JSON")) -> Model:
        try:
            return schema.model_validate_json(payload)
        except ValidationError as error:
            errors = [{**item, "loc": ("body", "payload", *item["loc"])} for item in error.errors()]
            raise RequestValidationError(errors) from error

    return parse
