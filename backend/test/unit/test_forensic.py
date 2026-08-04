from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from models.account import UserRole
from models.forensic import ForensicWorkplaceKind
from schemas.forensic import ForensicOrderDetailsInput, ForensicProfileInput
from services.forensic import (
    ForensicValidator,
    GetForensicProfileUseCase,
    SaveForensicProfileUseCase,
    UploadForensicDocumentUseCase,
)


def build_expert_account(profile: object = None) -> SimpleNamespace:
    """Аккаунт исполнителя; анкета судебного эксперта опциональна."""
    return SimpleNamespace(
        id=1,
        public_id="expert-public",
        role=UserRole.EXPERT,
        expert_profile=SimpleNamespace(id=5, forensic_profile=profile),
        customer_profile=None,
        license_holder_profile=None,
    )


def build_customer_account() -> SimpleNamespace:
    return SimpleNamespace(
        id=2,
        public_id="customer-public",
        role=UserRole.CUSTOMER,
        expert_profile=None,
        customer_profile=SimpleNamespace(id=7),
        license_holder_profile=None,
    )


def build_repo(account: SimpleNamespace | None) -> MagicMock:
    repo = MagicMock()
    repo.find_account = AsyncMock(return_value=account)
    repo.add = AsyncMock()
    return repo


def order_payload(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "applicant_full_name": "Петров Пётр Петрович",
        "applicant_position": "Юрист",
        "applicant_organization": "ООО Ромашка",
        "applicant_inn": "7707083893",
        "applicant_phone": "+7-999-000-00-00",
        "applicant_email": "customer@example.com",
        "expertise_purpose": "Установить причину аварии",
        "government_body": "Арбитражный суд города Москвы",
        "city": "Москва",
        "education_requirement": "Высшее техническое",
        "extra_requirements": "Стаж от 5 лет",
        "similar_experience_required": True,
        "duration": "45 дней",
    }
    payload.update(overrides)
    return payload


class TestForensicProfileSchema:
    def test_defaults_are_empty(self):
        payload = ForensicProfileInput()

        assert payload.education == ""
        assert payload.has_degree is False
        assert payload.workplace_kind is ForensicWorkplaceKind.INDIVIDUAL

    def test_degree_requires_text_when_flag_set(self):
        with pytest.raises(ValidationError):
            ForensicProfileInput(has_degree=True, degree="")

    def test_degree_cleared_when_flag_off(self):
        payload = ForensicProfileInput(has_degree=False, degree="к.т.н.")

        assert payload.degree == ""

    def test_filled_profile_accepted(self):
        payload = ForensicProfileInput(
            education="МГЮА",
            extra_education="Курсы судебной экспертизы",
            has_similar_experience=True,
            has_degree=True,
            degree="к.т.н.",
            city="Москва",
            workplace_kind=ForensicWorkplaceKind.ORGANIZATION,
            workplace_name="АНО «Центр экспертиз»",
        )

        assert payload.has_similar_experience is True
        assert payload.workplace_kind is ForensicWorkplaceKind.ORGANIZATION


class TestForensicOrderSchema:
    def test_full_form_accepted(self):
        payload = ForensicOrderDetailsInput(**order_payload())

        assert payload.similar_experience_required is True
        assert payload.government_body == "Арбитражный суд города Москвы"

    def test_government_body_required(self):
        with pytest.raises(ValidationError):
            ForensicOrderDetailsInput(**order_payload(government_body=""))

    def test_expertise_purpose_required(self):
        with pytest.raises(ValidationError):
            ForensicOrderDetailsInput(**order_payload(expertise_purpose=""))

    def test_city_required(self):
        with pytest.raises(ValidationError):
            ForensicOrderDetailsInput(**order_payload(city=""))

    def test_inn_must_be_ten_or_twelve_digits(self):
        with pytest.raises(ValidationError):
            ForensicOrderDetailsInput(**order_payload(applicant_inn="12345"))


class TestForensicProfileUseCases:
    @pytest.mark.asyncio
    async def test_empty_profile_returns_defaults(self):
        repo = build_repo(build_expert_account())
        use_case = GetForensicProfileUseCase(ForensicValidator(repo))

        profile = await use_case.execute(1)

        assert profile.education == ""
        assert profile.documents == []
        assert profile.education_diploma is None

    @pytest.mark.asyncio
    async def test_save_creates_profile(self):
        account = build_expert_account()
        repo = build_repo(account)
        use_case = SaveForensicProfileUseCase(repo, ForensicValidator(repo))

        result = await use_case.execute(
            1,
            ForensicProfileInput(education="МГЮА", city="Москва", has_similar_experience=True),
        )

        assert result.education == "МГЮА"
        assert result.has_similar_experience is True
        assert account.expert_profile.forensic_profile is not None
        repo.add.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_customer_gets_403(self):
        repo = build_repo(build_customer_account())
        use_case = GetForensicProfileUseCase(ForensicValidator(repo))

        with pytest.raises(HTTPException) as error:
            await use_case.execute(2)

        assert error.value.status_code == 403

    @pytest.mark.asyncio
    async def test_document_limit_enforced(self):
        documents = [{"name": f"{i}.pdf", "url": f"/u/{i}"} for i in range(10)]
        account = build_expert_account(SimpleNamespace(documents=documents))
        repo = build_repo(account)
        use_case = UploadForensicDocumentUseCase(repo, ForensicValidator(repo))

        with pytest.raises(HTTPException) as error:
            await use_case.execute(1, MagicMock())

        assert error.value.status_code == 400
