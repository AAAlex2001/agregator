"""Анкеты направлений, заполненные при регистрации.

Каждое направление — свой типизированный блок формы, роли проверены схемой
регистрации. Удостоверения ЭПБ пишутся прямо в профиль исполнителя, остальные
анкеты создаются отдельными таблицами и возвращаются для добавления в сессию.

Профили ролей к этому моменту уже созданы и сброшены flush'ем, поэтому анкеты
привязываются по явному внешнему ключу, а не через relationship: обращение
к незагруженной relationship на persistent-объекте запускает ленивую загрузку,
которая в async-сессии падает с MissingGreenlet.
"""
from models.account import Account
from models.audit import CustomerAuditProfile, ExpertAuditProfile, LicenseHolderAuditProfile
from models.cadastral import ExpertCadastralProfile
from models.design import ExpertDesignProfile
from models.ecology import ExpertEcologyProfile
from models.forensic import ExpertForensicProfile
from models.laboratory import ExpertLaboratoryProfile
from models.research import ExpertResearchProfile
from models.tech_diag import ExpertTechDiagProfile
from schemas.registration import UserRegistration

DirectionProfile = (
    CustomerAuditProfile
    | ExpertAuditProfile
    | ExpertCadastralProfile
    | ExpertDesignProfile
    | ExpertEcologyProfile
    | ExpertForensicProfile
    | ExpertLaboratoryProfile
    | ExpertResearchProfile
    | ExpertTechDiagProfile
    | LicenseHolderAuditProfile
)


def build_direction_profiles(account: Account, data: UserRegistration) -> list[DirectionProfile]:
    """Создаёт анкеты направлений из типизированных полей формы регистрации."""
    created: list[DirectionProfile] = []

    if data.expertise_profile is not None:
        account.expert_profile.certificates = [
            certificate.model_dump() for certificate in data.expertise_profile.certificates
        ]

    if data.audit_expert_profile is not None:
        created.append(
            ExpertAuditProfile(
                expert_id=account.expert_profile.id,
                documents=[],
                **data.audit_expert_profile.model_dump(),
            )
        )

    if data.audit_customer_profile is not None:
        created.append(
            CustomerAuditProfile(
                customer_id=account.customer_profile.id,
                **data.audit_customer_profile.model_dump(),
            )
        )

    if data.cadastral_profile is not None:
        created.append(
            ExpertCadastralProfile(
                expert_id=account.expert_profile.id,
                documents=[],
                **data.cadastral_profile.model_dump(),
            )
        )

    if data.forensic_profile is not None:
        created.append(
            ExpertForensicProfile(
                expert_id=account.expert_profile.id,
                documents=[],
                **data.forensic_profile.model_dump(),
            )
        )

    if data.research_profile is not None:
        created.append(
            ExpertResearchProfile(
                expert_id=account.expert_profile.id,
                **data.research_profile.model_dump(),
            )
        )

    if data.laboratory_profile is not None:
        created.append(
            ExpertLaboratoryProfile(
                expert_id=account.expert_profile.id,
                **data.laboratory_profile.model_dump(),
            )
        )

    if data.tech_diag_profile is not None:
        created.append(
            ExpertTechDiagProfile(
                expert_id=account.expert_profile.id,
                documents=[],
                **data.tech_diag_profile.model_dump(),
            )
        )

    if data.design_profile is not None:
        created.append(
            ExpertDesignProfile(
                expert_id=account.expert_profile.id,
                education_documents=[],
                nok_documents=[],
                nrs_documents=[],
                qualification_documents=[],
                rtn_documents=[],
                **data.design_profile.model_dump(),
            )
        )

    if data.ecology_profile is not None:
        created.append(
            ExpertEcologyProfile(
                expert_id=account.expert_profile.id,
                documents=[],
                **data.ecology_profile.model_dump(),
            )
        )

    return created
