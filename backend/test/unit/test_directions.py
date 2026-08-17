from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from models.account import UserRole
from models.order import OrderWorkType
from schemas.registration import UserRegistration
from services.directions.registry import DIRECTIONS, get_direction
from services.registration import direction_documents
from services.registration.direction_documents import (
    MAX_REGISTRATION_DOCUMENTS,
    attach_documents,
    upload_to_slot,
)
from services.registration.direction_profiles import build_direction_profiles


def registration_payload(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "role": "EXPERT",
        "email": "user@example.com",
        "password": "Secret-123",
        "password_confirm": "Secret-123",
        "expertise_profile": {},
        "privacy_consent": True,
        "terms_consent": True,
        "personal_data_consent": True,
    }
    payload.update(overrides)
    return payload


def build_expert_account() -> SimpleNamespace:
    expert = SimpleNamespace(
        id=5,
        certificates=[],
        audit_profile=None,
        cadastral_profile=None,
        forensic_profile=None,
        research_profile=None,
        laboratory_profile=None,
    )
    return SimpleNamespace(id=1, role=UserRole.EXPERT, expert_profile=expert, customer_profile=None)


def build_customer_account() -> SimpleNamespace:
    customer = SimpleNamespace(id=7, audit_profile=None)
    return SimpleNamespace(id=2, role=UserRole.CUSTOMER, expert_profile=None, customer_profile=customer)


class TestRegistry:
    "Реестр — единственное место, где перечислены направления и поля их заявок."

    def test_keys_are_unique(self):
        keys = [direction.key for direction in DIRECTIONS]
        assert len(keys) == len(set(keys))

    def test_get_direction_unknown_returns_none(self):
        assert get_direction("UNKNOWN") is None

    def test_expertise_has_no_order_details(self):
        "Заявка ЭПБ обходится общими полями заказа."
        assert get_direction(OrderWorkType.EXPERTISE.value).has_details is False

    @pytest.mark.parametrize(
        ("key", "attribute"),
        [
            (OrderWorkType.AUDIT_SUPB.value, "audit_details"),
            (OrderWorkType.CADASTRAL.value, "cadastral_details"),
            (OrderWorkType.FORENSIC.value, "forensic_details"),
            (OrderWorkType.RESEARCH.value, "research_details"),
            (OrderWorkType.LABORATORY.value, "laboratory_details"),
        ],
    )
    def test_direction_details_wiring(self, key, attribute):
        direction = get_direction(key)
        assert direction.has_details is True
        assert direction.details_attribute == attribute

    def test_details_attributes_are_unique(self):
        attributes = [d.details_attribute for d in DIRECTIONS if d.has_details]
        assert len(attributes) == len(set(attributes))


class TestRegistrationSchemaRoles:
    "Анкеты направлений в форме регистрации типизированы и привязаны к ролям."

    def test_expert_fills_expert_directions(self):
        data = UserRegistration(
            **registration_payload(
                cadastral_profile={"education": "МИИГАиК", "city": "Казань"},
                research_profile={"academic_degree": "к.т.н."},
            )
        )
        assert data.cadastral_profile.city == "Казань"

    def test_customer_cannot_fill_expert_directions(self):
        with pytest.raises(ValidationError):
            UserRegistration(
                **registration_payload(
                    role="CUSTOMER",
                    expertise_profile=None,
                    company_data={"value": "ООО Ромашка", "data": {"inn": "7707083893"}},
                    inn="7707083893",
                    forensic_profile={"education": "МГЮА"},
                )
            )

    def test_expert_cannot_fill_customer_audit_profile(self):
        with pytest.raises(ValidationError):
            UserRegistration(
                **registration_payload(audit_customer_profile={"position": "Главный инженер"})
            )

    def test_invalid_direction_fields_rejected(self):
        with pytest.raises(ValidationError):
            UserRegistration(
                **registration_payload(
                    audit_expert_profile={"audit_qualifications": ["40.20900.999"]}
                )
            )


class TestBuildDirectionProfiles:
    def test_expertise_written_into_role_profile(self):
        account = build_expert_account()
        data = UserRegistration(
            **registration_payload(
                expertise_profile={
                    "certificates": [{"area": "Э1", "object": "ТУ", "category": "3"}]
                }
            )
        )

        created = build_direction_profiles(account, data)

        assert created == []
        assert account.expert_profile.certificates[0]["area"] == "Э1"

    def test_expert_direction_profiles_created_with_expert_fk(self):
        account = build_expert_account()
        data = UserRegistration(
            **registration_payload(
                audit_expert_profile={"audit_qualifications": ["40.20900.185"]},
                cadastral_profile={"education": "МИИГАиК"},
                forensic_profile={"education": "МГЮА"},
                research_profile={"academic_degree": "к.т.н."},
                laboratory_profile={"accreditation_area": "Испытания бетона"},
            )
        )

        created = build_direction_profiles(account, data)

        assert len(created) == 5
        assert all(profile.expert_id == account.expert_profile.id for profile in created)
        assert created[0].audit_qualifications == ["40.20900.185"]
        assert created[1].education == "МИИГАиК"
        assert created[4].accreditation_area == "Испытания бетона"

    def test_customer_audit_profile_created_with_customer_fk(self):
        account = build_customer_account()
        data = UserRegistration(
                **registration_payload(
                    role="CUSTOMER",
                    expertise_profile=None,
                    company_data={"value": "ООО Ромашка", "data": {"inn": "7707083893"}},
                    inn="7707083893",
                    audit_customer_profile={"position": "Главный инженер"},
            )
        )

        created = build_direction_profiles(account, data)

        assert len(created) == 1
        assert created[0].customer_id == account.customer_profile.id
        assert created[0].position == "Главный инженер"

    def test_empty_form_creates_nothing(self):
        account = build_expert_account()
        data = UserRegistration(**registration_payload())
        data.expertise_profile = None

        assert build_direction_profiles(account, data) == []
        assert account.expert_profile.certificates == []


class TestRegistrationDocuments:
    "Файлы регистрации раскладываются по слотам через use case своих направлений."

    @pytest.mark.asyncio
    async def test_each_file_goes_to_its_slot(self, monkeypatch):
        calls = AsyncMock()
        monkeypatch.setattr(direction_documents, "upload_to_slot", calls)

        await attach_documents(None, 7, ["CADASTRAL_DIPLOMA", "FORENSIC"], ["диплом", "курс"])

        assert [call.args[2:] for call in calls.await_args_list] == [
            ("CADASTRAL_DIPLOMA", "диплом"),
            ("FORENSIC", "курс"),
        ]

    @pytest.mark.asyncio
    async def test_count_mismatch_raises_400(self):
        with pytest.raises(HTTPException) as error:
            await attach_documents(None, 7, ["CADASTRAL"], ["диплом", "курс"])
        assert error.value.status_code == 400

    @pytest.mark.asyncio
    async def test_too_many_documents_rejected(self):
        count = MAX_REGISTRATION_DOCUMENTS + 1
        with pytest.raises(HTTPException) as error:
            await attach_documents(None, 7, ["FORENSIC"] * count, ["файл"] * count)
        assert error.value.status_code == 400

    @pytest.mark.asyncio
    async def test_unknown_slot_raises_400(self):
        with pytest.raises(HTTPException) as error:
            await upload_to_slot(None, 7, "UNKNOWN", "файл")
        assert error.value.status_code == 400
