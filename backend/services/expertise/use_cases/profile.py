"""Use cases: анкета исполнителя по экспертизе промышленной безопасности."""
from schemas.expertise import ExpertiseProfileInput, ExpertiseProfileResponse
from services.expertise.repository import ExpertiseRepository
from services.expertise.validators import ExpertiseValidator


class GetExpertiseProfileUseCase:
    """Возвращает удостоверения эксперта из профиля исполнителя."""

    def __init__(self, validator: ExpertiseValidator) -> None:
        self.validator = validator

    async def execute(self, account_id: int) -> ExpertiseProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)
        return ExpertiseProfileResponse(certificates=expert.certificates or [])


class SaveExpertiseProfileUseCase:
    """Записывает удостоверения эксперта прямо в профиль исполнителя.

    У ЭПБ нет отдельной таблицы анкеты: удостоверения — поле профиля роли.
    """

    def __init__(self, repo: ExpertiseRepository, validator: ExpertiseValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(
        self, account_id: int, data: ExpertiseProfileInput
    ) -> ExpertiseProfileResponse:
        """Запускает основной сценарий use case."""
        account = await self.validator.require_account(account_id)
        expert = self.validator.require_expert(account)

        expert.certificates = [certificate.model_dump() for certificate in data.certificates]

        await self.repo.add(expert)
        return ExpertiseProfileResponse(certificates=expert.certificates)
