"""Аттестации кандидата сверяются со справочником областей и объектов экспертизы."""

from app.blitz.catalog import AREA_BY_CODE
from app.commission.schemas import AttestationSchema
from app.commission.services.exceptions import InvalidAttestationError


def validate_attestation(attestation: AttestationSchema) -> None:
    """Область есть в справочнике, и объект по ней выдаётся. Иначе InvalidAttestationError."""

    area = AREA_BY_CODE.get(attestation.area_code)
    if area is None:
        raise InvalidAttestationError(f"Неизвестная область аттестации: {attestation.area_code}")

    if attestation.object_code not in area.objects:
        raise InvalidAttestationError(
            f"По области {attestation.area_code} не выдаётся аттестация {attestation.object_code}",
        )
