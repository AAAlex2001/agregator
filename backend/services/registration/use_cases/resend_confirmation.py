from fastapi import BackgroundTasks, HTTPException, status

from schemas.registration import UserRole
from services.registration.disposable_email_domains import ensure_email_not_disposable
from services.registration.notifier import RegistrationNotifier
from services.registration.repository import RegistrationRepository


class ResendConfirmationUseCase:
    "Повторно отправляет код подтверждения email юзеру с неподтверждённой почтой."

    def __init__(self, repo: RegistrationRepository, notifier: RegistrationNotifier):
        self.repo = repo
        self.notifier = notifier

    async def execute(
        self,
        email: str,
        background_tasks: BackgroundTasks,
        role: UserRole | None = None,
    ) -> None:
        ensure_email_not_disposable(email)
        candidates = await self.repo.find_users_by_email(email, role)
        if not candidates:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        unverified = [u for u in candidates if not u.email_verified]
        user = unverified[0] if unverified else candidates[0]

        if user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Почта уже подтверждена",
            )
        await self.notifier.schedule_confirmation_email(user, background_tasks)
