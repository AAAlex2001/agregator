"Use case: list license holders."
from models.user import User
from services.license_holders.repository import LicenseHoldersRepository


class ListLicenseHoldersUseCase:
    "Каталог активных держателей лицензии. Видим только эксперту (auth-проверка на роутере)."

    def __init__(self, repo: LicenseHoldersRepository) -> None:
        self.repo = repo

    async def execute(self, skip: int, limit: int) -> tuple[list[User], int]:
        "Запускает основной сценарий use case."
        return await self.repo.list_active(skip, limit)
