"""Администратор задаёт тариф аудита СУПБ: ориентир цены в форме заявки на аудит."""

from decimal import Decimal

from app.blitz.audit.options import MIN_AUDIT_PRICE
from app.blitz.orders.services.exceptions import InvalidOrderError
from app.blitz.pricing.models import Tariff
from app.blitz.pricing.services.repo import AUDIT_AREA, AUDIT_OBJECT, TariffRepository
from app.core.money import format_rub


class SaveAuditTariffUseCase:
    """Пустая цена убирает тариф: в форме аудита ориентира не будет."""

    def __init__(self, tariffs: TariffRepository) -> None:
        self.tariffs = tariffs

    async def execute(self, price: Decimal | None) -> Tariff | None:
        """Ниже минимальной стоимости аудита — InvalidOrderError."""

        if price is not None and price < MIN_AUDIT_PRICE:
            raise InvalidOrderError(f"Тариф аудита — не менее {format_rub(MIN_AUDIT_PRICE)}")

        tariff = await self.tariffs.audit()

        if price is None and tariff is not None:
            await self.tariffs.delete(tariff)
            tariff = None
        elif price is not None and tariff is not None:
            tariff.price = price
        elif price is not None:
            tariff = Tariff(area_code=AUDIT_AREA, object_code=AUDIT_OBJECT, price=price)
            self.tariffs.add(tariff)

        await self.tariffs.save()

        return tariff
