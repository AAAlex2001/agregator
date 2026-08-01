from types import SimpleNamespace

from models.account import UserRole
from services.settings.formatters import to_response

DIRECTION_FIELDS = frozenset(
    {"position", "opo_license_number", "expert_certificates", "expert_show_on_map", "expert_map_fields"}
)


def build_account(role: UserRole, **profiles: object) -> SimpleNamespace:
    "Аккаунт с профилями ролей; незаданные профили пустые."
    return SimpleNamespace(
        id=1,
        role=role,
        email="user@example.com",
        email_verified=True,
        phone="+79990000000",
        avatar_url=None,
        first_name="Иван",
        last_name="Петров",
        inn=None,
        company_data=None,
        notifications_introduced=False,
        customer_profile=profiles.get("customer"),
        expert_profile=profiles.get("expert"),
        license_holder_profile=profiles.get("holder"),
    )


def build_expert() -> SimpleNamespace:
    return SimpleNamespace(
        rating=4.5,
        review_count=3,
        location_lat=55.75,
        location_lng=37.61,
        location_address="Москва",
        location_city="Москва",
        travels_to_other_regions=True,
        notify_order_types=["EXPERTISE"],
    )


def build_holder() -> SimpleNamespace:
    return SimpleNamespace(
        license_number="ДЭ-00-000000",
        license_file_url="/uploads/license.pdf",
        license_areas=["ТУ"],
        license_rental_kind="PERCENT",
        license_rental_percent=10.0,
        license_rental_fixed_amount=None,
        mining_license_number="",
        mining_license_file_url=None,
        sro_design_file_url=None,
        lab_accreditation_number="",
        lab_accreditation_file_url=None,
        company_card_url=None,
    )


class TestToResponse:
    "Профиль ЛК: общее — плоско, роль-специфичное — своим блоком."

    def test_customer_has_no_role_blocks(self):
        response = to_response(build_account(UserRole.CUSTOMER, customer=SimpleNamespace()))

        assert response.role == "CUSTOMER"
        assert response.email == "user@example.com"
        assert response.expert is None
        assert response.license_holder is None

    def test_expert_block_filled(self):
        response = to_response(build_account(UserRole.EXPERT, expert=build_expert()))

        assert response.expert is not None
        assert response.expert.location_city == "Москва"
        assert response.expert.travels_to_other_regions is True
        assert response.notify_order_types == ["EXPERTISE"]
        assert response.license_holder is None

    def test_license_holder_block_filled(self):
        response = to_response(build_account(UserRole.LICENSE_HOLDER, holder=build_holder()))

        assert response.license_holder is not None
        assert response.license_holder.license_number == "ДЭ-00-000000"
        assert response.expert is None
        assert response.notify_order_types == []

    def test_direction_fields_never_leak_into_profile(self):
        "Поля анкет направлений отдаёт /directions, в профиле их быть не должно."
        response = to_response(build_account(UserRole.CUSTOMER))

        assert not DIRECTION_FIELDS & set(response.model_dump())
