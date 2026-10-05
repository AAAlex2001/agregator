"""Минимальная заполненность профиля; проверка квалификации не выполняется."""

from models.account import Account
from models.expert import Expert


def is_profile_complete(account: Account) -> bool:
    """Проверяет минимальную заполненность профиля приглашённого."""
    if not (account.first_name or "").strip():
        return False

    expert = account.expert_profile
    if expert is None:
        return False

    return has_direction_details(expert)


def has_direction_details(expert: Expert) -> bool:
    """Проверяет, есть ли содержательные данные в одном из десяти направлений."""
    if expert.certificates:
        return True

    audit = expert.audit_profile
    if audit and (
        audit.industrial_safety_areas or audit.expert_attestation_areas or audit.audit_qualifications
    ):
        return True

    cadastral = expert.cadastral_profile
    if cadastral and (has_text(cadastral.education) or has_text(cadastral.registry_number)):
        return True

    forensic = expert.forensic_profile
    if forensic and (has_text(forensic.education) or has_text(forensic.extra_education)):
        return True

    research = expert.research_profile
    if research and (has_text(research.research_field) or research.science_branches):
        return True

    laboratory = expert.laboratory_profile
    if laboratory and (has_text(laboratory.accreditation_area) or has_text(laboratory.comment)):
        return True

    tech_diag = expert.tech_diag_profile
    if tech_diag and (
        has_text(tech_diag.qualification_certificates) or tech_diag.methods or tech_diag.control_objects
    ):
        return True

    design = expert.design_profile
    if design and (has_text(design.education) or design.specialties):
        return True

    ecology = expert.ecology_profile
    if ecology and (ecology.work_types or has_text(ecology.practical_skills)):
        return True

    survey = expert.survey_profile
    return bool(survey and (has_text(survey.education) or survey.kinds or has_text(survey.kinds_other)))


def has_text(value: str | None) -> bool:
    """Проверяет, содержит ли строка символы кроме пробелов."""
    return bool(value and value.strip())
