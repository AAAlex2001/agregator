import json
from datetime import date as date_type, datetime as datetime_type

from schemas.order import BadgeOptionResponse, BadgeSchema, OrderCreate, OrderUpdate


BADGE_OPTIONS: list[BadgeOptionResponse] = [
    BadgeOptionResponse(text="ТУ", variant="BLUE", label="Укажите типовые наименования ТУ"),
    BadgeOptionResponse(text="КЛ", variant="GRAY", label="Укажите типовые наименования КЛ"),
    BadgeOptionResponse(text="ТП", variant="ORANGE", label="Укажите типовые наименования ТП"),
    BadgeOptionResponse(text="Д", variant="BROWN", label="Укажите типовые наименования Д"),
    BadgeOptionResponse(text="ЗС", variant="GREEN", label="Укажите типовые наименования ЗС"),
    BadgeOptionResponse(text="ОБ", variant="PURPLE", label="Укажите типовые наименования ОБ"),
]


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


def parse_badges_json(raw: str) -> list[BadgeSchema]:
    return [
        BadgeSchema(text=item["text"], variant=item["variant"])
        for item in parse_json_list(raw)
    ]


def build_badges_from_inputs(raw: str) -> tuple[list[BadgeSchema], str]:
    options_by_variant = {item.variant: item for item in BADGE_OPTIONS}
    badges: list[BadgeSchema] = []
    typical_names_parts: list[str] = []

    for item in parse_json_list(raw):
        variant = str(item.get("variant", "")).strip()
        option = options_by_variant.get(variant)
        if not option:
            continue

        names = [
            name.strip()
            for name in str(item.get("names", "")).split(",")
            if name.strip()
        ]

        if not names:
            badges.append(BadgeSchema(text=option.text, variant=option.variant))
            continue

        typical_names_parts.extend(names)
        for name in names:
            badges.append(BadgeSchema(text=f"{option.text} {name}", variant=option.variant))

    return badges, ", ".join(typical_names_parts)


def resolve_badges_and_typical_names(
    badge_inputs_json: str,
    badges_json: str,
    typical_names: str,
) -> tuple[list[BadgeSchema], str]:
    if badge_inputs_json:
        return build_badges_from_inputs(badge_inputs_json)
    return parse_badges_json(badges_json), typical_names


def build_order_create_data(
    title: str,
    company: str,
    typical_names: str,
    comment: str,
    customer_id: int,
    sum_amount: int,
    deadline: str,
    responses_deadline: str,
    badge_inputs_json: str,
    badges_json: str,
) -> OrderCreate:
    badges, resolved_typical_names = resolve_badges_and_typical_names(
        badge_inputs_json,
        badges_json,
        typical_names,
    )

    return OrderCreate(
        title=title,
        company=company,
        typical_names=resolved_typical_names,
        comment=comment,
        customer_id=customer_id,
        sum_amount=sum_amount,
        deadline=date_type.fromisoformat(deadline),
        responses_deadline=parse_responses_deadline(responses_deadline),
        badges=badges,
    )


def build_order_update_data(
    title: str,
    company: str,
    typical_names: str,
    comment: str,
    sum_amount: int,
    deadline: str,
    responses_deadline: str,
    badge_inputs_json: str,
    badges_json: str,
    keep_files: str,
) -> OrderUpdate:
    badges, resolved_typical_names = resolve_badges_and_typical_names(
        badge_inputs_json,
        badges_json,
        typical_names,
    )

    return OrderUpdate(
        title=title,
        company=company,
        typical_names=resolved_typical_names,
        comment=comment,
        sum_amount=sum_amount,
        deadline=date_type.fromisoformat(deadline),
        responses_deadline=parse_responses_deadline(responses_deadline),
        badges=badges,
        technical_files=parse_json_list(keep_files),
    )