"""JSON-поле формы и русские ошибки проверки на настоящем FastAPI-приложении."""

from fastapi import Depends, FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.testclient import TestClient
from pydantic import BaseModel, Field, field_validator

from app.core.errors import AppError, app_error_handler
from app.core.forms import json_form
from app.core.validation import validation_error_handler


class Person(BaseModel):
    """Вложенные данные."""

    passport: str = Field(..., min_length=10)


class Payload(BaseModel):
    """Данные формы."""

    name: str = Field(..., min_length=3)
    price: int = Field(..., gt=0)
    person: Person

    @field_validator("name")
    @classmethod
    def no_digits(cls, value: str) -> str:
        """Своя проверка с русским текстом."""

        if any(char.isdigit() for char in value):
            raise ValueError("Имя без цифр")

        return value


app = FastAPI()
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(AppError, app_error_handler)


@app.post("/form")
async def submit(payload: Payload = Depends(json_form(Payload))) -> dict[str, str]:
    """Принимает JSON-поле формы."""

    return {"name": payload.name}


@app.post("/fail")
async def fail() -> None:
    """Ошибка сценария с полем."""

    raise AppError("Серия и номер паспорта — 10 цифр", "individual.passport_number")


client = TestClient(app)


def test_json_payload_is_parsed_from_multipart_form() -> None:
    body = '{"name": "Иван", "price": 5, "person": {"passport": "4506123456"}}'

    response = client.post("/form", data={"payload": body})

    assert response.status_code == 200
    assert response.json() == {"name": "Иван"}


def test_errors_are_russian_with_field_path_and_without_input() -> None:
    body = '{"name": "Ив1", "price": 0, "person": {"passport": "123"}}'

    detail = client.post("/form", data={"payload": body}).json()["detail"]
    messages = {".".join(map(str, item["loc"])): item["msg"] for item in detail}

    assert messages == {
        "body.payload.name": "Имя без цифр",
        "body.payload.price": "Должно быть больше 0",
        "body.payload.person.passport": "Слишком коротко: не меньше 10 символов",
    }
    assert all("input" not in item for item in detail)


def test_missing_and_broken_payload() -> None:
    missing = client.post("/form", data={}).json()["detail"]
    broken = client.post("/form", data={"payload": "{"}).json()["detail"]

    assert missing[0]["msg"] == "Обязательное поле"
    assert broken[0]["msg"].startswith("Данные формы повреждены")


def test_app_error_reports_its_field() -> None:
    response = client.post("/fail")

    assert response.json() == {
        "detail": "Серия и номер паспорта — 10 цифр",
        "field": "individual.passport_number",
    }
