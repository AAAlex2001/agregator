"Use case: upload avatar."
from fastapi import UploadFile

from models.account import Account
from services.settings.avatar_storage import AvatarStorage
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UploadAvatarUseCase:
    "Сохраняет файл аватара и обновляет ссылку у пользователя."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator) -> None:
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, file: UploadFile) -> Account:
        "Запускает основной сценарий use case."
        user = await self.validator.require_user(user_id)
        new_url = await AvatarStorage.save(user, file)
        user.avatar_url = new_url
        await self.repo.flush()
        return user
