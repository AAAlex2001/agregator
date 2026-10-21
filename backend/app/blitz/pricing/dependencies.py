"""Цены: репозиторий тарифов и сценарии."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.notifications import BlitzNotifier, get_blitz_notifier
from app.blitz.orders.dependencies import get_order_repository
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.pricing.services.repo import TariffRepository
from app.blitz.pricing.services.usecases.change_price import ChangePriceUseCase
from app.blitz.pricing.services.usecases.save_audit_tariff import SaveAuditTariffUseCase
from app.blitz.pricing.services.usecases.save_tariffs import SaveTariffsUseCase
from app.core.database import get_db


def get_tariff_repository(db: AsyncSession = Depends(get_db)) -> TariffRepository:
    """Репозиторий тарифов с сессией текущего запроса."""

    return TariffRepository(db)


def get_save_tariffs_usecase(
    tariffs: TariffRepository = Depends(get_tariff_repository),
) -> SaveTariffsUseCase:
    """Сохранение сетки тарифов."""

    return SaveTariffsUseCase(tariffs)


def get_save_audit_tariff_usecase(
    tariffs: TariffRepository = Depends(get_tariff_repository),
) -> SaveAuditTariffUseCase:
    """Сохранение тарифа аудита."""

    return SaveAuditTariffUseCase(tariffs)


def get_change_price_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> ChangePriceUseCase:
    """Смена цены заявки."""

    return ChangePriceUseCase(orders, notifier)
