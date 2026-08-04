"""Анкеты направлений, заполненные при регистрации.

Каждое направление — свой типизированный блок формы, роли проверены схемой
регистрации. Удостоверения ЭПБ пишутся прямо в профиль исполнителя, остальные
анкеты создаются отдельными таблицами и возвращаются для добавления в сессию.
"""
from models.account import Account
from models.audit import CustomerAuditProfile, ExpertAuditProfile
from models.cadastral import ExpertCadastralProfile
from models.forensic import ExpertForensicProfile
from models.laboratory import ExpertLaboratoryProfile
from models.research import ExpertResearchProfile
from schemas.registration import UserRegistration

DirectionProfile = (
    CustomerAuditProfile
    | ExpertAuditProfile
    | ExpertCadastralProfile
    | ExpertForensicProfile
    | ExpertLaboratoryProfile
    | ExpertResearchProfile
)


def build_direction_profiles(account: Account, data: UserRegistration) -> list[DirectionProfile]:
    """Создаёт анкеты направлений из типизированных полей формы регистрации."""
    created: list[DirectionProfile] = []
    expert = account.expert_profile
    customer = account.customer_profile

    if data.expertise_profile is not None:
        expert.certificates = [
            certificate.model_dump() for certificate in data.expertise_profile.certificates
        ]

    if data.audit_expert_profile is not None:
        profile = ExpertAuditProfile(documents=[], **data.audit_expert_profile.model_dump())
        expert.audit_profile = profile
        created.append(profile)

    if data.audit_customer_profile is not None:
        profile = CustomerAuditProfile(**data.audit_customer_profile.model_dump())
        customer.audit_profile = profile
        created.append(profile)

    if data.cadastral_profile is not None:
        profile = ExpertCadastralProfile(documents=[], **data.cadastral_profile.model_dump())
        expert.cadastral_profile = profile
        created.append(profile)

    if data.forensic_profile is not None:
        profile = ExpertForensicProfile(documents=[], **data.forensic_profile.model_dump())
        expert.forensic_profile = profile
        created.append(profile)

    if data.research_profile is not None:
        profile = ExpertResearchProfile(**data.research_profile.model_dump())
        expert.research_profile = profile
        created.append(profile)

    if data.laboratory_profile is not None:
        profile = ExpertLaboratoryProfile(**data.laboratory_profile.model_dump())
        expert.laboratory_profile = profile
        created.append(profile)

    return created
