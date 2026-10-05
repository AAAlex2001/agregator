"""Условия заполненности профилей всех направлений."""

import pytest

from models.account import Account
from models.audit import ExpertAuditProfile
from models.base import Base
from models.cadastral import ExpertCadastralProfile
from models.design import ExpertDesignProfile
from models.ecology import ExpertEcologyProfile
from models.expert import Expert
from models.forensic import ExpertForensicProfile
from models.laboratory import ExpertLaboratoryProfile
from models.research import ExpertResearchProfile
from models.survey import ExpertSurveyProfile
from models.tech_diag import ExpertTechDiagProfile
from services.referrals.profile_policy import is_profile_complete


@pytest.fixture
def account() -> Account:
    return Account(first_name="Иван", expert_profile=Expert(certificates=[]))


@pytest.mark.parametrize(
    ("attribute", "profile"),
    [
        ("audit_profile", ExpertAuditProfile(audit_qualifications=["Аудитор"])),
        ("cadastral_profile", ExpertCadastralProfile(education="Профильное образование")),
        ("forensic_profile", ExpertForensicProfile(education="Профильное образование")),
        ("research_profile", ExpertResearchProfile(research_field="Металлургия")),
        ("laboratory_profile", ExpertLaboratoryProfile(accreditation_area="Испытания материалов")),
        ("tech_diag_profile", ExpertTechDiagProfile(methods=["УЗК"])),
        ("design_profile", ExpertDesignProfile(education="Проектирование")),
        ("ecology_profile", ExpertEcologyProfile(practical_skills="Экологическая отчётность")),
        ("survey_profile", ExpertSurveyProfile(kinds_other="Геодезия")),
    ],
)
def test_filled_direction_is_eligible(account: Account, attribute: str, profile: Base) -> None:
    setattr(account.expert_profile, attribute, profile)

    assert is_profile_complete(account)


@pytest.mark.parametrize(
    ("attribute", "profile"),
    [
        ("audit_profile", ExpertAuditProfile()),
        ("cadastral_profile", ExpertCadastralProfile(education="   ")),
        ("forensic_profile", ExpertForensicProfile()),
        ("research_profile", ExpertResearchProfile()),
        ("laboratory_profile", ExpertLaboratoryProfile()),
        ("tech_diag_profile", ExpertTechDiagProfile()),
        ("design_profile", ExpertDesignProfile()),
        ("ecology_profile", ExpertEcologyProfile()),
        ("survey_profile", ExpertSurveyProfile()),
    ],
)
def test_empty_direction_is_not_eligible(account: Account, attribute: str, profile: Base) -> None:
    setattr(account.expert_profile, attribute, profile)

    assert not is_profile_complete(account)


def test_expertise_certificates_fill_profile(account: Account) -> None:
    account.expert_profile.certificates = [{"area": "Э1", "object": "ТУ", "category": "3"}]

    assert is_profile_complete(account)


@pytest.mark.parametrize("name", [None, "", "   "])
def test_name_is_required(account: Account, name: str | None) -> None:
    account.first_name = name
    account.expert_profile.research_profile = ExpertResearchProfile(research_field="НИР")

    assert not is_profile_complete(account)


def test_account_without_expert_profile_is_not_complete() -> None:
    assert not is_profile_complete(Account(first_name="Иван"))
