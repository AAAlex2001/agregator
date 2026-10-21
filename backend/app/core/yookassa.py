"""Клиент ЮKassa: создать платёж с переходом на оплату и узнать его состояние.

Статусу из уведомления не верим — состояние всегда перепроверяется запросом к API.
Документация: https://yookassa.ru/developers/api
"""

from dataclasses import dataclass
from decimal import Decimal
from typing import Any

import httpx

from app.core.config import get_settings
from app.core.errors import AppError

API_URL = "https://api.yookassa.ru/v3"
TIMEOUT_SECONDS = 15
CURRENCY = "RUB"
DESCRIPTION_LIMIT = 128


class PaymentGatewayError(AppError):
    """ЮKassa не настроена, недоступна или отказала."""

    status_code = 502
    message = "Платёжный сервис недоступен, попробуйте позже"


@dataclass(frozen=True)
class GatewayPayment:
    """Платёж ЮKassa: id, статус и ссылка на страницу оплаты."""

    id: str
    status: str
    confirmation_url: str | None


def parse_payment(data: dict[str, Any]) -> GatewayPayment:
    """Платёж из ответа API."""

    confirmation = data.get("confirmation") or {}

    return GatewayPayment(
        id=data["id"],
        status=data["status"],
        confirmation_url=confirmation.get("confirmation_url"),
    )


class YooKassaClient:
    """Запросы к API с Basic-авторизацией магазина."""

    def __init__(self, shop_id: str, secret_key: str, vat_code: int) -> None:
        self.auth = (shop_id, secret_key)
        self.vat_code = vat_code

    async def create_payment(
        self,
        amount: Decimal,
        description: str,
        email: str,
        return_url: str,
        idempotence_key: str,
    ) -> GatewayPayment:
        """Платёж с переходом на страницу оплаты и чеком по 54-ФЗ на почту плательщика.

        Деньги списываются сразу. На один ключ идемпотентности ЮKassa создаёт один платёж.
        """

        price = {"value": f"{amount:.2f}", "currency": CURRENCY}
        body = {
            "amount": price,
            "capture": True,
            "confirmation": {"type": "redirect", "return_url": return_url},
            "description": description[:DESCRIPTION_LIMIT],
            "receipt": {
                "customer": {"email": email},
                "items": [
                    {
                        "description": description[:DESCRIPTION_LIMIT],
                        "quantity": "1.00",
                        "amount": price,
                        "vat_code": self.vat_code,
                        "payment_subject": "service",
                        "payment_mode": "full_payment",
                    }
                ],
            },
        }

        return await self.request("POST", "/payments", body, {"Idempotence-Key": idempotence_key})

    async def get_payment(self, payment_id: str) -> GatewayPayment:
        """Текущее состояние платежа."""

        return await self.request("GET", f"/payments/{payment_id}", None, {})

    async def request(
        self,
        method: str,
        path: str,
        body: dict[str, Any] | None,
        headers: dict[str, str],
    ) -> GatewayPayment:
        """Запрос к API. Сеть или отказ — PaymentGatewayError."""

        if not all(self.auth):
            raise PaymentGatewayError("Оплата картой пока не подключена")

        async with httpx.AsyncClient(base_url=API_URL, auth=self.auth, timeout=TIMEOUT_SECONDS) as client:
            try:
                response = await client.request(method, path, json=body, headers=headers)
            except httpx.HTTPError as error:
                raise PaymentGatewayError from error

        if response.status_code >= 400:
            raise PaymentGatewayError

        return parse_payment(response.json())


def get_yookassa_client() -> YooKassaClient:
    """Клиент с ключами магазина из настроек."""

    settings = get_settings()

    return YooKassaClient(settings.yookassa_shop_id, settings.yookassa_secret_key, settings.yookassa_vat_code)
