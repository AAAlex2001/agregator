"""Сборка справочников для анкет направлений."""
from schemas.directions import CatalogOption, DirectionCatalogsResponse
from services.audit_catalogs import (
    ACCREDITATION_AREAS,
    AUDIT_QUALIFICATIONS,
    INDUSTRIAL_SAFETY_AREAS,
)
from services.experts.badge_codes import ALL_BADGE_CODES


def build_direction_catalogs() -> DirectionCatalogsResponse:
    "Собирает все справочники, из которых заполняются анкеты направлений."
    return DirectionCatalogsResponse(
        industrial_safety_areas=[CatalogOption.model_validate(item) for item in INDUSTRIAL_SAFETY_AREAS],
        expert_attestation_areas=[CatalogOption(code=code) for code in ALL_BADGE_CODES],
        audit_qualifications=[CatalogOption.model_validate(item) for item in AUDIT_QUALIFICATIONS],
        accreditation_areas=[CatalogOption.model_validate(item) for item in ACCREDITATION_AREAS],
    )
