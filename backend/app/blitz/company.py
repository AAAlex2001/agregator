"""Исполнитель по договорам Блиц-эксперта: реквизиты для счёта и акта, ставка НДС из окружения."""

from dataclasses import dataclass

from app.core.config import get_settings


@dataclass(frozen=True)
class Company:
    """Реквизиты организации."""

    name: str
    inn: str
    kpp: str
    ogrn: str
    address: str
    bank: str
    bic: str
    account: str
    corr_account: str
    director: str


COMPANY = Company(
    name="ООО «НПИ «Недра»",
    inn="4205325060",
    kpp="540501001",
    ogrn="1164205057136",
    address=(
        "630008, Новосибирская область, г.о. город Новосибирск, г. Новосибирск, "
        "ул. Кирова, зд. 113/2, помещ. 2409"
    ),
    bank="Филиал «Новосибирский» АО «Альфа-Банк»",
    bic="045004774",
    account="40702810823060001828",
    corr_account="30101810600000000774",
    director="С.В. Самохин",
)


def vat_rate() -> int:
    """Ставка НДС в процентах из COMPANY_VAT_RATE. 0 — без НДС."""

    return get_settings().company_vat_rate
