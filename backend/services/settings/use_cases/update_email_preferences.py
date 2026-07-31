"Use case: update email preferences."
from typing import Any

from models.account import Account, UserRole
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UpdateEmailPreferencesUseCase:
    "Частичный патч флагов email-уведомлений: каждое поле пишется в аккаунт или профиль своей роли."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, patch: dict[str, Any]) -> Account:
        "Запускает основной сценарий use case; поля чужой роли молча пропускаются."
        account = await self.validator.require_user(user_id)
        updates = dict(patch)
        targets = (
            account,
            account.customer_profile,
            account.expert_profile,
            account.license_holder_profile,
        )
        if account.role == UserRole.LICENSE_HOLDER:
            updates.pop("email_on_labor_listing", None)
            if account.license_holder_profile is not None:
                account.license_holder_profile.email_on_labor_listing = True
        for field, value in updates.items():
            for target in targets:
                if target is not None and hasattr(target, field):
                    setattr(target, field, value)
                    break
        await self.repo.flush()
        return account
