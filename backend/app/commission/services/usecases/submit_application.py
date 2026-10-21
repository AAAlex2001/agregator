"""Кандидат подаёт заявку в конкурсную комиссию."""

from app.commission.models import CommissionApplication
from app.commission.schemas import ApplicationCreateSchema
from app.commission.services.letters import CommissionLetters
from app.commission.services.repo import CommissionRepository
from app.commission.services.validators import validate_attestation


class SubmitApplicationUseCase:
    """Сохраняет заявку и сообщает кандидату и администраторам."""

    def __init__(self, applications: CommissionRepository, letters: CommissionLetters) -> None:
        self.applications = applications
        self.letters = letters

    async def execute(self, data: ApplicationCreateSchema) -> CommissionApplication:
        """Аттестация не по справочнику — InvalidAttestationError."""

        for attestation in data.attestations:
            validate_attestation(attestation)

        application = CommissionApplication(
            full_name=data.full_name.strip(),
            phone=data.phone.strip(),
            email=str(data.email),
            attestations=[item.model_dump() for item in data.attestations],
            message=data.message.strip() if data.message else None,
        )
        await self.applications.add(application)
        self.letters.received(application)

        return application
