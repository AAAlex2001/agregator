from typing import get_args, get_origin

import pytest
from pydantic import BaseModel, ValidationError

from schemas.registration import LicenseHolderRegistration, UserRegistration
from services.registration.validation_errors import (
    REGISTRATION_FIELD_LABELS,
    registration_validation_message,
)

COMPANY = {
    "value": "ООО Проверка",
    "unrestricted_value": "ООО Проверка",
    "data": {"inn": "7707083893"},
}


def nested_models(annotation: object) -> list[type[BaseModel]]:
    result: list[type[BaseModel]] = []
    arguments = get_args(annotation)
    candidates = arguments or (annotation,)
    for candidate in candidates:
        if get_origin(candidate):
            result.extend(nested_models(candidate))
        elif isinstance(candidate, type) and issubclass(candidate, BaseModel):
            result.append(candidate)
    return result


def registration_field_names(model: type[BaseModel], visited: set[type[BaseModel]]) -> set[str]:
    if model in visited:
        return set()
    visited.add(model)
    names = set(model.model_fields)
    for field in model.model_fields.values():
        for child_model in nested_models(field.annotation):
            names.update(registration_field_names(child_model, visited))
    return names


def valid_holder_payload() -> dict[str, object]:
    return {
        "email": "holder@example.com",
        "password": "Secret-123",
        "password_confirm": "Secret-123",
        "inn": "7707083893",
        "company_data": COMPANY,
        "directions": ["CADASTRAL"],
        "privacy_consent": True,
        "terms_consent": True,
        "personal_data_consent": True,
    }


def test_every_registration_field_has_a_russian_label():
    fields = registration_field_names(UserRegistration, set())
    fields.update(registration_field_names(LicenseHolderRegistration, set()))

    assert fields <= REGISTRATION_FIELD_LABELS.keys()
    assert all(
        any("а" <= char.lower() <= "я" or char.lower() == "ё" for char in label)
        for label in REGISTRATION_FIELD_LABELS.values()
    )


@pytest.mark.parametrize(
    ("payload", "expected_message"),
    [
        (
            {**valid_holder_payload(), "audit_profile": {}},
            "Заполните поле «номер свидетельства об аккредитации»",
        ),
        (
            {
                "role": "EXPERT",
                "email": "expert@example.com",
                "password": "Secret-123",
                "password_confirm": "Secret-123",
                "cadastral_profile": {"certificate_number": "x" * 101},
                "privacy_consent": True,
                "terms_consent": True,
                "personal_data_consent": True,
            },
            "Поле «номер аттестата кадастрового инженера» содержит слишком много символов",
        ),
    ],
)
def test_direction_errors_use_context_specific_russian_labels(payload, expected_message):
    schema = LicenseHolderRegistration if "inn" in payload else UserRegistration
    with pytest.raises(ValidationError) as captured:
        schema(**payload)

    assert registration_validation_message(captured.value) == expected_message
