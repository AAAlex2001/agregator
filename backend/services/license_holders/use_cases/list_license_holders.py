"Use case: list license holders."
from models.account import Account
from models.license_holder import LicenseHolder
from services.license_holders.repository import LicenseHoldersRepository


class ListLicenseHoldersUseCase:
    "Каталог активных держателей лицензии. Видим только эксперту (auth-проверка на роутере)."

    def __init__(self, repo: LicenseHoldersRepository) -> None:
        self.repo = repo

    async def execute(
        self, skip: int, limit: int
    ) -> tuple[list[tuple[Account, LicenseHolder]], int]:
        "Запускает основной сценарий use case."
        return await self.repo.list_active(skip, limit)
