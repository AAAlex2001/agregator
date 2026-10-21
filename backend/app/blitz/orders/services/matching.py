"""Подбор эксперта по удостоверениям из его анкеты.

Пустые объект, область и категория заявки ничего не ограничивают. Категория 1 — самая высокая,
поэтому эксперт подходит, если его категория не больше требуемой. Просроченные удостоверения
не учитываются.
"""

from dataclasses import dataclass
from datetime import date

from app.blitz.catalog import object_covers
from app.blitz.orders.models import BlitzOrder
from models.account import Account


@dataclass(frozen=True)
class Certificate:
    """Удостоверение эксперта: область, объект, категория и срок действия."""

    area: str
    object: str
    category: int | None
    expires_at: date | None


def parse_category(value: object) -> int | None:
    """Категория из анкеты: строка «3» или число."""

    try:
        return int(str(value))
    except ValueError:
        return None


def parse_date(value: object) -> date | None:
    """Дата из анкеты в формате ГГГГ-ММ-ДД или None."""

    try:
        return date.fromisoformat(str(value)[:10])
    except ValueError:
        return None


def certificates_of(account: Account) -> list[Certificate]:
    """Удостоверения из анкеты эксперта."""

    profile = account.expert_profile
    if profile is None or not profile.certificates:
        return []

    return [
        Certificate(
            area=str(item.get("area", "")),
            object=str(item.get("object", "")),
            category=parse_category(item.get("category")),
            expires_at=parse_date(item.get("expires_at")) if item.get("expires_at") else None,
        )
        for item in profile.certificates
    ]


def certificate_fits(certificate: Certificate, order: BlitzOrder, today: date) -> bool:
    """Удостоверение действует и подходит под заявку."""

    if certificate.expires_at is not None and certificate.expires_at < today:
        return False

    if order.area_code is not None and certificate.area != order.area_code:
        return False

    if order.object_code is not None and not object_covers(certificate.object, order.object_code):
        return False

    if order.expert_category is None:
        return True

    return certificate.category is not None and certificate.category <= order.expert_category


def expert_fits(account: Account, order: BlitzOrder, today: date) -> bool:
    """Есть ли у эксперта удостоверение под заявку."""

    return any(certificate_fits(item, order, today) for item in certificates_of(account))
