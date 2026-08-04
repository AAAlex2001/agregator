from datetime import UTC, datetime

from schemas.order import OrderCreate
from services.orders.forms import build_order_create_data


def build_order(responses_deadline: str) -> OrderCreate:
    return OrderCreate.model_validate(
        {
            "title": "Проверка времени",
            "customer_id": 1,
            "sum_amount": 0,
            "deadline": "2026-09-30",
            "responses_deadline": responses_deadline,
        }
    )


def test_naive_responses_deadline_is_treated_as_moscow_time() -> None:
    order = build_order("2026-08-31T19:00")

    assert order.responses_deadline == datetime(2026, 8, 31, 16, 0, tzinfo=UTC)


def test_explicit_moscow_responses_deadline_is_normalized_to_utc() -> None:
    order = build_order("2026-08-31T19:00:00+03:00")

    assert order.responses_deadline == datetime(2026, 8, 31, 16, 0, tzinfo=UTC)


def test_multipart_order_deadline_is_treated_as_moscow_time() -> None:
    order = build_order_create_data(
        title="Проверка multipart",
        company="",
        comment="",
        customer_id=1,
        sum_amount=0,
        start_date="",
        deadline="2026-09-30",
        responses_deadline="2026-08-31T19:00",
        badge_codes_json="[]",
    )

    assert order.responses_deadline == datetime(2026, 8, 31, 16, 0, tzinfo=UTC)
