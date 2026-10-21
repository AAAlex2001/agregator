"""Аудитор для карточки заявки и Плана: имя и области аттестации из анкеты."""

from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.schemas import TeamMemberSchema
from models.account import Account


def auditor_areas(account: Account) -> list[str]:
    """Области аттестации из анкеты аудитора: «Э1 КЛ/ТП»."""

    profile = account.expert_profile
    if profile is None or profile.audit_profile is None:
        return []

    return list(profile.audit_profile.expert_attestation_areas)


def describe(account: Account, lead: bool) -> TeamMemberSchema:
    """Аудитор с областями и признаком руководителя."""

    return TeamMemberSchema(id=account.id, name=account.display_name, areas=auditor_areas(account), lead=lead)


def team_of(order: BlitzOrder) -> list[TeamMemberSchema]:
    """Руководитель группы первым, за ним остальные аудиторы."""

    lead = [describe(order.expert, True)] if order.expert else []

    return lead + [describe(member.account, False) for member in order.team]


def team_accounts(order: BlitzOrder) -> list[Account]:
    """Все аудиторы группы вместе с руководителем."""

    lead = [order.expert] if order.expert else []

    return lead + [member.account for member in order.team]
