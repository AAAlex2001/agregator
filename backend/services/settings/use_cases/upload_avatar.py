from fastapi import UploadFile

from models.user import User
from services.settings.avatar_storage import AvatarStorage
from services.settings.repository import SettingsRepository
from services.settings.validators import SettingsValidator


class UploadAvatarUseCase:
    "Сохраняет файл аватара и обновляет ссылку у пользователя."

    def __init__(self, repo: SettingsRepository, validator: SettingsValidator):
        self.repo = repo
        self.validator = validator

    async def execute(self, user_id: int, file: UploadFile) -> User:
        user = await self.validator.get_user_or_404(user_id)
        new_url = await AvatarStorage.save(user, file)
        user.avatar_url = new_url
        await self.repo.flush()
        return user
