"""Сборка справочников для анкет и заявки аудита СУПБ."""
from schemas.audit import AuditCatalogsResponse, CatalogOption
from services.audit_catalogs import (
    ACCREDITATION_AREAS,
    AUDIT_AREAS_P17,
    AUDIT_QUALIFICATIONS,
    INDUSTRIAL_SAFETY_AREAS,
)
from services.experts.badge_codes import ALL_BADGE_CODES


def build_audit_catalogs() -> AuditCatalogsResponse:
    """Собирает справочники: аттестации, НОК, аккредитация, направления п.17 Приказа 318."""
    return AuditCatalogsResponse(
        industrial_safety_areas=[CatalogOption.model_validate(item) for item in INDUSTRIAL_SAFETY_AREAS],
        expert_attestation_areas=[CatalogOption(code=code) for code in ALL_BADGE_CODES],
        audit_qualifications=[CatalogOption.model_validate(item) for item in AUDIT_QUALIFICATIONS],
        accreditation_areas=[CatalogOption.model_validate(item) for item in ACCREDITATION_AREAS],
        audit_areas=[CatalogOption.model_validate(item) for item in AUDIT_AREAS_P17],
    )
