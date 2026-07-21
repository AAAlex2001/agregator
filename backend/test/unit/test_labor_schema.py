import pytest
from pydantic import ValidationError

from schemas.labor import LaborCertificate


def test_labor_certificate_accepts_exact_requirement() -> None:
    certificate = LaborCertificate(
        area="Э1",
        object="КЛ/ТП",
        category="1",
    )

    assert certificate.model_dump(exclude_none=True) == {
        "area": "Э1",
        "object": "КЛ/ТП",
        "category": "1",
    }


def test_labor_certificate_accepts_general_requirement() -> None:
    certificate = LaborCertificate(object="КЛ")

    assert certificate.model_dump(exclude_none=True) == {
        "object": "КЛ",
    }


def test_labor_certificate_rejects_empty_requirement() -> None:
    with pytest.raises(ValidationError):
        LaborCertificate()
