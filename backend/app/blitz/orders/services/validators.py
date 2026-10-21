"""Проверки заявки: коды по справочнику, категория эксперта, вид договора, реквизиты, роли."""

from app.blitz.catalog import (
    AREA_BY_CODE,
    CATEGORIES,
    HAZARD_CLASS_CATEGORY,
    OBJECT_BY_CODE,
    ContractKind,
    kinds_for,
)
from app.blitz.orders.services.exceptions import (
    CustomerRequiredError,
    ExpertRequiredError,
    InvalidOrderError,
)
from models.account import Account, UserRole

INN_LENGTHS = (10, 12)
OGRN_LENGTHS = (13, 15)
KPP_LENGTH = 9
BIC_LENGTH = 9
ACCOUNT_LENGTH = 20
PASSPORT_LENGTH = 10


def require_customer(user: Account) -> None:
    """Пользователь — заказчик. Иначе CustomerRequiredError."""

    if user.role != UserRole.CUSTOMER:
        raise CustomerRequiredError


def require_expert(user: Account) -> None:
    """Пользователь — эксперт. Иначе ExpertRequiredError."""

    if user.role != UserRole.EXPERT:
        raise ExpertRequiredError


def validate_codes(object_code: str | None, area_code: str | None) -> None:
    """Указанные коды есть в справочнике, а объект выдаётся по области. Пустые — не проверяются."""

    if area_code is not None and area_code not in AREA_BY_CODE:
        raise InvalidOrderError(f"Неизвестная область аттестации: {area_code}", "area_code")

    if object_code is not None and object_code not in OBJECT_BY_CODE:
        raise InvalidOrderError(f"Неизвестный объект экспертизы: {object_code}", "object_code")

    if object_code is None or area_code is None:
        return

    if object_code not in AREA_BY_CODE[area_code].objects:
        raise InvalidOrderError(
            f"По области {area_code} экспертиза {object_code} не проводится",
            "area_code",
        )


def resolve_category(hazard_class: int | None, category: int | None) -> int | None:
    """Требуемая категория эксперта: по классу опасности, если он указан, иначе как есть."""

    if hazard_class is not None:
        resolved = HAZARD_CLASS_CATEGORY.get(hazard_class)
        if resolved is None:
            raise InvalidOrderError("Класс опасности — от I до IV", "hazard_class")
        return resolved

    if category is not None and category not in CATEGORIES:
        raise InvalidOrderError("Категория эксперта — от 1 до 3", "expert_category")

    return category


def resolve_kind(object_code: str | None, chosen: str | None) -> ContractKind | None:
    """Вид договора: выбранный должен подходить объекту, единственный подходящий ставится сам."""

    allowed = kinds_for(object_code)

    if chosen is not None:
        if chosen not in allowed:
            raise InvalidOrderError("Вид договора не подходит объекту экспертизы", "contract_kind")
        return ContractKind(chosen)

    return allowed[0] if len(allowed) == 1 else None


def digits(value: str) -> str:
    """Только цифры: пробелы и дефисы в реквизитах не важны."""

    return "".join(char for char in value if char.isdigit())


def digits_of_length(value: str, lengths: tuple[int, ...], message: str, field: str) -> str:
    """Цифры нужной длины. Иначе InvalidOrderError с текстом message и путём к полю."""

    result = digits(value)
    if len(result) not in lengths:
        raise InvalidOrderError(message, field)

    return result


def normalize_inn(inn: str, field: str) -> str:
    """ИНН: 10 цифр у организации, 12 у предпринимателя."""

    return digits_of_length(inn, INN_LENGTHS, "ИНН — 10 или 12 цифр", field)


def normalize_ogrn(ogrn: str, field: str) -> str:
    """ОГРН из 13 цифр или ОГРНИП из 15."""

    return digits_of_length(ogrn, OGRN_LENGTHS, "ОГРН — 13 или 15 цифр", field)


def normalize_kpp(kpp: str | None, field: str) -> str | None:
    """КПП из 9 цифр. У предпринимателя его нет."""

    if not kpp or not kpp.strip():
        return None

    return digits_of_length(kpp, (KPP_LENGTH,), "КПП — 9 цифр", field)


def normalize_bic(bic: str, field: str) -> str:
    """БИК банка из 9 цифр."""

    return digits_of_length(bic, (BIC_LENGTH,), "БИК — 9 цифр", field)


def normalize_account(account: str, title: str, field: str) -> str:
    """Расчётный или корреспондентский счёт из 20 цифр."""

    return digits_of_length(account, (ACCOUNT_LENGTH,), f"{title} — 20 цифр", field)


def normalize_passport(number: str, field: str) -> str:
    """Серия и номер паспорта: 10 цифр, серия отделена пробелом."""

    message = "Серия и номер паспорта — 10 цифр"
    result = digits_of_length(number, (PASSPORT_LENGTH,), message, field)

    return f"{result[:4]} {result[4:]}"
