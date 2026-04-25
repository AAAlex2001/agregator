import json
from datetime import date as date_type, datetime as datetime_type

from schemas.order import BadgeSchema, OrderCreate, OrderUpdate


TYPE_VARIANT = {
    "ТУ": "ORANGE",
    "КЛ": "BLUE",
    "ТП": "BLUE",
    "КЛ/ТП": "BLUE",
    "ЗС": "GREEN",
    "Д": "BROWN",
    "ОБ": "GRAY",
}


def parse_json_list(raw: str) -> list:
    try:
        value = json.loads(raw)
    except json.JSONDecodeError:
        return []

    return value if isinstance(value, list) else []


def parse_responses_deadline(raw: str) -> datetime_type | None:
    if not raw:
        return None
    return datetime_type.fromisoformat(raw)


def code_to_variant(code: str) -> str:
    parts = code.split(" ", 1)
    if len(parts) < 2:
        return "ORANGE"
    return TYPE_VARIANT.get(parts[1].strip(), "ORANGE")


def parse_badge_codes(raw: str) -> list[BadgeSchema]:
    return [
        BadgeSchema(text=str(code).strip(), variant=code_to_variant(str(code)))
        for code in parse_json_list(raw)
        if str(code).strip()
    ]


def build_order_create_data(
    title: str,
    company: str,
    comment: str,
    customer_id: int,
    sum_amount: int,
    deadline: str,
    responses_deadline: str,
    badge_codes_json: str,
) -> OrderCreate:
    return OrderCreate(
        title=title,
        company=company,
        comment=comment,
        customer_id=customer_id,
        sum_amount=sum_amount,
        deadline=date_type.fromisoformat(deadline),
        responses_deadline=parse_responses_deadline(responses_deadline),
        badges=parse_badge_codes(badge_codes_json),
    )


def build_order_update_data(
    title: str,
    company: str,
    comment: str,
    sum_amount: int,
    deadline: str,
    responses_deadline: str,
    badge_codes_json: str,
    keep_files: str,
) -> OrderUpdate:
    return OrderUpdate(
        title=title,
        company=company,
        comment=comment,
        sum_amount=sum_amount,
        deadline=date_type.fromisoformat(deadline),
        responses_deadline=parse_responses_deadline(responses_deadline),
        badges=parse_badge_codes(badge_codes_json),
        technical_files=parse_json_list(keep_files),
    )
