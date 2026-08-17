import pytest
from pydantic import ValidationError

from schemas.registration import LicenseHolderRegistration, UserRegistration

COMPANY = {
    "value": "ООО Проверка",
    "unrestricted_value": "ООО Проверка",
    "data": {"inn": "7707083893"},
}


def common_payload() -> dict[str, object]:
    return {
        "email": "registration@example.com",
        "password": "Secret-123",
        "password_confirm": "Secret-123",
        "privacy_consent": True,
        "terms_consent": True,
        "personal_data_consent": True,
    }


def customer_payload(**overrides: object) -> dict[str, object]:
    payload = {
        **common_payload(),
        "role": "CUSTOMER",
        "inn": "7707083893",
        "company_data": COMPANY,
    }
    payload.update(overrides)
    return payload


def expert_payload(**overrides: object) -> dict[str, object]:
    payload = {**common_payload(), "role": "EXPERT"}
    payload.update(overrides)
    return payload


def holder_payload(**overrides: object) -> dict[str, object]:
    payload = {
        **common_payload(),
        "inn": "7707083893",
        "company_data": COMPANY,
    }
    payload.update(overrides)
    return payload


@pytest.mark.parametrize(
    "direction_data",
    [
        {"directions": ["EXPERTISE"]},
        {"audit_customer_profile": {}},
        {"directions": ["TECH_DIAG"]},
        {"directions": ["DESIGN"]},
        {"directions": ["RESEARCH"]},
        {"directions": ["LABORATORY"]},
        {"directions": ["CADASTRAL"]},
        {"directions": ["FORENSIC"]},
    ],
)
def test_customer_registration_accepts_every_direction(direction_data):
    data = UserRegistration(**customer_payload(**direction_data))
    assert data.role.value == "CUSTOMER"


@pytest.mark.parametrize(
    "profile_data",
    [
        {"expertise_profile": {}},
        {"audit_expert_profile": {}},
        {"tech_diag_profile": {}},
        {"design_profile": {}},
        {"research_profile": {}},
        {"laboratory_profile": {}},
        {"cadastral_profile": {}},
        {"forensic_profile": {}},
    ],
)
def test_expert_registration_accepts_every_direction(profile_data):
    data = UserRegistration(**expert_payload(**profile_data))
    assert data.role.value == "EXPERT"


@pytest.mark.parametrize("direction", ["RESEARCH", "LABORATORY", "CADASTRAL", "FORENSIC"])
def test_holder_registration_accepts_generic_direction_without_epb_license(direction):
    data = LicenseHolderRegistration(**holder_payload(directions=[direction]))
    assert data.directions == [direction]
    assert data.license_number is None


@pytest.mark.parametrize(
    "direction_data",
    [
        {
            "license_number": "Л-123",
            "license_areas": ["ТУ"],
            "license_rental_kind": "NEGOTIABLE",
        },
        {"audit_profile": {"certificate_number": "А-123"}},
        {"tech_diag_profile": {}},
        {"design_profile": {"pricing_kind": "NEGOTIABLE"}},
    ],
)
def test_holder_registration_accepts_profile_directions(direction_data):
    data = LicenseHolderRegistration(**holder_payload(**direction_data))
    assert data.inn == "7707083893"


@pytest.mark.parametrize(
    ("schema", "payload"),
    [
        (UserRegistration, customer_payload(directions=["CADASTRAL"])),
        (UserRegistration, expert_payload(cadastral_profile={})),
        (LicenseHolderRegistration, holder_payload(directions=["CADASTRAL"])),
    ],
)
def test_phone_is_optional_for_every_role(schema, payload):
    data = schema(**payload)
    assert data.phone is None


@pytest.mark.parametrize(
    ("schema", "payload"),
    [
        (UserRegistration, customer_payload()),
        (UserRegistration, expert_payload()),
        (LicenseHolderRegistration, holder_payload()),
    ],
)
def test_every_role_requires_a_direction(schema, payload):
    with pytest.raises(ValidationError, match="Выберите хотя бы одно направление"):
        schema(**payload)


def test_holder_generic_directions_do_not_trigger_license_validation():
    data = LicenseHolderRegistration(
        **holder_payload(
            directions=["CADASTRAL", "FORENSIC"],
            license_number="",
            license_areas=[],
            license_rental_kind=None,
        )
    )
    assert data.directions == ["CADASTRAL", "FORENSIC"]


def test_partial_epb_license_has_clear_russian_error():
    with pytest.raises(ValidationError, match="Укажите номер лицензии"):
        LicenseHolderRegistration(
            **holder_payload(license_areas=["ТУ"], license_rental_kind="NEGOTIABLE")
        )


def test_password_confirmation_is_checked_on_backend():
    with pytest.raises(ValidationError, match="Пароли не совпадают"):
        UserRegistration(
            **customer_payload(directions=["CADASTRAL"], password_confirm="Different-123")
        )


def test_consents_are_checked_on_backend():
    with pytest.raises(ValidationError, match="Политикой конфиденциальности"):
        UserRegistration(
            **customer_payload(directions=["CADASTRAL"], privacy_consent=False)
        )
