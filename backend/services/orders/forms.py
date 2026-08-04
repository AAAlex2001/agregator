"Разбор multipart-полей формы заказа в pydantic-схемы."
import json
from datetime import date as date_type
from datetime import datetime as datetime_type

from fastapi import HTTPException, status

from models.order import OrderWorkType
from schemas.order import BadgeSchema, OrderCreate, OrderDocuments, OrderUpdate

TYPE_VARIANT = {
    "ТУ": "ORANGE",
    "КЛ": "BLUE",
    "ТП": "BLUE",
    "КЛ/ТП": "BLUE",
    "ЗС": "GREEN",
    "Д": "BROWN",
    "ОБ": "GRAY",
}


def parse_json_list(raw: str) -> list[object]:
    "Парсит JSON-список из строки формы; мусор означает пустой список."
    try:
        value = json.loads(raw)
    except json.JSONDecodeError:
        return []

    return value if isinstance(value, list) else []


def parse_required_date(raw: str) -> date_type:
    "Парсит обязательную дату формы; невалидное значение — 422."
    try:
        return date_type.fromisoformat(raw)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Некорректная дата",
        )


def parse_optional_date(raw: str) -> date_type | None:
    "Парсит необязательную дату формы; невалидное значение — 422."
    if not raw:
        return None
    return parse_required_date(raw)


def parse_responses_deadline(raw: str) -> datetime_type | None:
    "Парсит срок приёма откликов; невалидное значение — 422."
    if not raw:
        return None
    try:
        return datetime_type.fromisoformat(raw)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Некорректная дата приёма откликов",
        )


def code_to_variant(code: str) -> str:
    "Определяет цвет бейджа по типу объекта из кода экспертизы."
    parts = code.split(" ", 1)
    if len(parts) < 2:
        return "ORANGE"
    return TYPE_VARIANT.get(parts[1].strip(), "ORANGE")


def parse_badge_codes(raw: str) -> list[BadgeSchema]:
    "Строит бейджи заказа из JSON-списка кодов экспертизы."
    return [
        BadgeSchema(text=str(code).strip(), variant=code_to_variant(str(code)))
        for code in parse_json_list(raw)
        if str(code).strip()
    ]


def parse_keep_documents(raw: str) -> OrderDocuments:
    "Парсит JSON формата {technical, contract, company, other} -> OrderDocuments."
    try:
        value = json.loads(raw or "{}")
    except json.JSONDecodeError:
        value = {}
    if not isinstance(value, dict):
        value = {}
    return OrderDocuments(
        technical=list(value.get("technical") or []),
        contract=list(value.get("contract") or []),
        company=list(value.get("company") or []),
        other=list(value.get("other") or []),
    )


def parse_details(raw: str) -> dict[str, object] | None:
    "Парсит поля направления из multipart. Пустая строка и мусор означают «деталей нет»."
    if not raw:
        return None
    try:
        value = json.loads(raw)
    except json.JSONDecodeError:
        return None
    return value if isinstance(value, dict) else None


def build_order_create_data(
    title: str,
    company: str,
    comment: str,
    customer_id: int,
    sum_amount: int,
    start_date: str,
    deadline: str,
    responses_deadline: str,
    badge_codes_json: str,
    requires_expert: bool = True,
    requires_license: bool = True,
    work_type: OrderWorkType = OrderWorkType.EXPERTISE,
    details_json: str = "",
) -> OrderCreate:
    "Собирает OrderCreate из multipart-полей формы."
    return OrderCreate(
        title=title,
        company=company,
        comment=comment,
        customer_id=customer_id,
        sum_amount=sum_amount,
        start_date=parse_optional_date(start_date),
        deadline=parse_required_date(deadline),
        responses_deadline=parse_responses_deadline(responses_deadline),
        requires_expert=requires_expert,
        requires_license=requires_license,
        work_type=work_type,
        details=parse_details(details_json),
        badges=parse_badge_codes(badge_codes_json),
    )


def build_order_update_data(
    title: str,
    company: str,
    comment: str,
    sum_amount: int,
    start_date: str,
    deadline: str,
    responses_deadline: str,
    badge_codes_json: str,
    keep_documents_json: str,
    requires_expert: bool | None = None,
    requires_license: bool | None = None,
    work_type: OrderWorkType | None = None,
    notify_responders: bool = True,
    details_json: str = "",
) -> OrderUpdate:
    "Собирает OrderUpdate из multipart-полей формы."
    return OrderUpdate(
        title=title,
        company=company,
        comment=comment,
        sum_amount=sum_amount,
        start_date=parse_optional_date(start_date),
        deadline=parse_required_date(deadline),
        responses_deadline=parse_responses_deadline(responses_deadline),
        requires_expert=requires_expert,
        requires_license=requires_license,
        work_type=work_type,
        details=parse_details(details_json),
        badges=parse_badge_codes(badge_codes_json),
        documents=parse_keep_documents(keep_documents_json),
        notify_responders=notify_responders,
    )
