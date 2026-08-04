import pytest

from models.order import OrderWorkType
from services.orders.forms import build_order_create_data, build_order_update_data, parse_details


class TestParseDetails:
    "Поля направления приезжают из multipart строкой JSON."

    def test_empty_means_no_details(self):
        assert parse_details("") is None

    def test_broken_json_means_no_details(self):
        assert parse_details("{не json") is None

    def test_non_object_means_no_details(self):
        assert parse_details("[1, 2]") is None

    def test_empty_object_is_valid_details(self):
        "Пустой объект — валидные детали: у НИР и лаборатории все поля со значениями по умолчанию."
        assert parse_details("{}") == {}

    def test_object_is_returned_as_is(self):
        assert parse_details('{"work_location": "Москва"}') == {"work_location": "Москва"}


class TestOrderFormsCarryDetails:
    @pytest.mark.parametrize(
        ("raw", "expected"),
        [("", None), ('{"work_location": "Тула"}', {"work_location": "Тула"})],
    )
    def test_create_data(self, raw, expected):
        data = build_order_create_data(
            title="Межевание",
            company="",
            comment="",
            customer_id=1,
            sum_amount=1000,
            start_date="",
            deadline="2026-09-01",
            responses_deadline="",
            badge_codes_json="[]",
            work_type=OrderWorkType.CADASTRAL,
            details_json=raw,
        )
        assert data.details == expected

    def test_update_data(self):
        data = build_order_update_data(
            title="Межевание",
            company="",
            comment="",
            sum_amount=1000,
            start_date="",
            deadline="2026-09-01",
            responses_deadline="",
            badge_codes_json="[]",
            keep_documents_json="{}",
            work_type=OrderWorkType.CADASTRAL,
            details_json='{"work_location": "Тула"}',
        )
        assert data.details == {"work_location": "Тула"}
