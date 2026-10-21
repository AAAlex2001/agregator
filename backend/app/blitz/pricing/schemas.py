"""Тарифы и смена цены заявки в API."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.core.money import Money

MAX_PRICE = Decimal("99999999")


class TariffSchema(BaseModel):
    """Ориентир цены по паре «область × объект»."""

    model_config = ConfigDict(from_attributes=True)

    area_code: str
    object_code: str
    price: Money


class TariffCellSchema(BaseModel):
    """Ячейка сетки тарифов. Пустая цена удаляет тариф."""

    area_code: str = Field(..., max_length=8, description="Область аттестации")
    object_code: str = Field(..., max_length=8, description="Объект экспертизы")
    price: Decimal | None = Field(None, gt=0, le=MAX_PRICE, decimal_places=2, description="Цена, ₽")


class TariffsSaveSchema(BaseModel):
    """Сетка тарифов из админки: сохраняется целиком."""

    items: list[TariffCellSchema] = Field(..., max_length=500)


class ChangePriceSchema(BaseModel):
    """Новая цена заявки и причина для сторон."""

    price: Decimal = Field(..., gt=0, le=MAX_PRICE, decimal_places=2, description="Новая цена, ₽")
    reason: str = Field(..., min_length=3, max_length=1000, description="Почему цена изменилась")
