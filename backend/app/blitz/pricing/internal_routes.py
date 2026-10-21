"""Цены в админке: сетка тарифов экспертиз, тариф аудита и цена конкретной заявки."""

from fastapi import APIRouter, Depends

from app.blitz.orders.dependencies import get_admin_order
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.schemas import CatalogSchema, OrderSchema
from app.blitz.orders.services.presenter import details
from app.blitz.pricing.dependencies import (
    get_change_price_usecase,
    get_save_audit_tariff_usecase,
    get_save_tariffs_usecase,
    get_tariff_repository,
)
from app.blitz.pricing.schemas import (
    AuditTariffSaveSchema,
    AuditTariffSchema,
    ChangePriceSchema,
    TariffSchema,
    TariffsSaveSchema,
)
from app.blitz.pricing.services.repo import TariffRepository
from app.blitz.pricing.services.usecases.change_price import ChangePriceUseCase
from app.blitz.pricing.services.usecases.save_audit_tariff import SaveAuditTariffUseCase
from app.blitz.pricing.services.usecases.save_tariffs import SaveTariffsUseCase

router = APIRouter(tags=["admin-blitz"])


@router.get("/catalog")
async def get_catalog() -> CatalogSchema:
    """Области и объекты для сетки тарифов."""

    return CatalogSchema.build()


@router.get("/tariffs")
async def list_tariffs(tariffs: TariffRepository = Depends(get_tariff_repository)) -> list[TariffSchema]:
    """Текущие тарифы."""

    return [TariffSchema.model_validate(item) for item in await tariffs.list_all()]


@router.put("/tariffs")
async def save_tariffs(
    data: TariffsSaveSchema,
    usecase: SaveTariffsUseCase = Depends(get_save_tariffs_usecase),
) -> list[TariffSchema]:
    """Сохранить сетку тарифов целиком."""

    return [TariffSchema.model_validate(item) for item in await usecase.execute(data.items)]


@router.get("/tariffs/audit")
async def get_audit_tariff(tariffs: TariffRepository = Depends(get_tariff_repository)) -> AuditTariffSchema:
    """Тариф аудита СУПБ."""

    tariff = await tariffs.audit()

    return AuditTariffSchema(price=tariff.price if tariff else None)


@router.put("/tariffs/audit")
async def save_audit_tariff(
    data: AuditTariffSaveSchema,
    usecase: SaveAuditTariffUseCase = Depends(get_save_audit_tariff_usecase),
) -> AuditTariffSchema:
    """Задать тариф аудита не ниже 100 000 ₽ или убрать его."""

    tariff = await usecase.execute(data.price)

    return AuditTariffSchema(price=tariff.price if tariff else None)


@router.put("/orders/{order_id}/price")
async def change_price(
    data: ChangePriceSchema,
    order: BlitzOrder = Depends(get_admin_order),
    usecase: ChangePriceUseCase = Depends(get_change_price_usecase),
) -> OrderSchema:
    """Поменять цену заявки с причиной: стороны получат уведомление."""

    return details(await usecase.execute(order, data.price, data.reason), None)
