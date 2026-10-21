"""Конкурсная комиссия без базы и почты: проверка аттестаций, подача и решение."""

import asyncio

import pytest

from app.commission.models import ApplicationStatus, CommissionApplication
from app.commission.schemas import ApplicationCreateSchema, AttestationSchema
from app.commission.services.exceptions import InvalidAttestationError
from app.commission.services.usecases.review_application import ReviewApplicationUseCase
from app.commission.services.usecases.submit_application import SubmitApplicationUseCase
from app.commission.services.validators import validate_attestation


class FakeApplications:
    """Репозиторий без базы."""

    def __init__(self) -> None:
        self.added: list[CommissionApplication] = []

    async def add(self, application: CommissionApplication) -> None:
        self.added.append(application)

    async def save(self) -> None:
        return None


class FakeLetters:
    """Запоминает, о каких заявках ушли письма."""

    def __init__(self) -> None:
        self.received_ids: list[str] = []
        self.decided_statuses: list[str] = []

    def received(self, application: CommissionApplication) -> None:
        self.received_ids.append(application.full_name)

    def decided(self, application: CommissionApplication) -> None:
        self.decided_statuses.append(application.status)


def candidate(area_code: str = "Э12", object_code: str = "КЛ/ТП") -> ApplicationCreateSchema:
    """Заявка кандидата с одной аттестацией."""

    return ApplicationCreateSchema(
        full_name="  Петров Пётр Петрович ",
        phone="+79990000000",
        email="petrov@mail.ru",
        attestations=[AttestationSchema(area_code=area_code, object_code=object_code, category=2)],
        message=" Стаж 10 лет ",
    )


def test_attestation_follows_catalog() -> None:
    validate_attestation(AttestationSchema(area_code="Э12", object_code="КЛ/ТП", category=1))

    with pytest.raises(InvalidAttestationError, match="Неизвестная"):
        validate_attestation(AttestationSchema(area_code="Э99", object_code="КЛ", category=1))

    with pytest.raises(InvalidAttestationError, match="не выдаётся"):
        validate_attestation(AttestationSchema(area_code="Э12", object_code="Д", category=1))


def test_submitted_application_is_saved_and_acknowledged() -> None:
    applications = FakeApplications()
    letters = FakeLetters()

    application = asyncio.run(SubmitApplicationUseCase(applications, letters).execute(candidate()))

    assert applications.added == [application]
    assert application.full_name == "Петров Пётр Петрович"
    assert application.message == "Стаж 10 лет"
    assert letters.received_ids == ["Петров Пётр Петрович"]


def test_wrong_attestation_is_not_saved() -> None:
    applications = FakeApplications()
    usecase = SubmitApplicationUseCase(applications, FakeLetters())

    with pytest.raises(InvalidAttestationError):
        asyncio.run(usecase.execute(candidate(object_code="Д")))

    assert applications.added == []


def test_candidate_hears_only_about_status_change() -> None:
    letters = FakeLetters()
    usecase = ReviewApplicationUseCase(FakeApplications(), letters)
    application = CommissionApplication(full_name="Петров", status=ApplicationStatus.NEW)

    asyncio.run(usecase.execute(application, ApplicationStatus.ACCEPTED, " Ждём на собеседование "))
    asyncio.run(usecase.execute(application, ApplicationStatus.ACCEPTED, "Собеседование в пятницу"))

    assert letters.decided_statuses == [ApplicationStatus.ACCEPTED]
    assert application.decision == "Собеседование в пятницу"
    assert application.reviewed_at is not None
