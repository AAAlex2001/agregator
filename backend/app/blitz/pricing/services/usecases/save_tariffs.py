"""Администратор сохраняет сетку тарифов."""

from app.blitz.orders.services.validators import validate_codes
from app.blitz.pricing.models import Tariff
from app.blitz.pricing.schemas import TariffCellSchema
from app.blitz.pricing.services.repo import TariffRepository


class SaveTariffsUseCase:
    """Каждая ячейка — пара «область × объект» и цена. Применяется вся сетка или ничего."""

    def __init__(self, tariffs: TariffRepository) -> None:
        self.tariffs = tariffs

    async def execute(self, cells: list[TariffCellSchema]) -> list[Tariff]:
        """Пара не по справочнику — InvalidOrderError."""

        for cell in cells:
            validate_codes(cell.object_code, cell.area_code)

        existing = await self.tariffs.by_pair()

        for cell in cells:
            tariff = existing.get((cell.area_code, cell.object_code))

            if cell.price is None and tariff is not None:
                await self.tariffs.delete(tariff)
            elif cell.price is not None and tariff is not None:
                tariff.price = cell.price
            elif cell.price is not None:
                tariff = Tariff(area_code=cell.area_code, object_code=cell.object_code, price=cell.price)
                self.tariffs.add(tariff)

        await self.tariffs.save()

        return await self.tariffs.list_all()
