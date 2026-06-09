"Сервисный модуль: receipts."
import os
import re
from typing import Any

from fastapi import HTTPException, status

from models.pricing import PricingPlan
from models.user import User
from services.subscriptions.constants import (
    DEFAULT_VAT_CODE_FALLBACK,
    KOPECKS_PER_RUBLE,
    YOOKASSA_CURRENCY,
    YOOKASSA_ITEM_DESCRIPTION_MAX_LEN,
    YOOKASSA_PAYMENT_MODE_FULL,
    YOOKASSA_PAYMENT_SUBJECT_SERVICE,
    YOOKASSA_RECEIPT_QUANTITY,
)

DEFAULT_VAT_CODE = int(os.getenv("YOOKASSA_VAT_CODE", DEFAULT_VAT_CODE_FALLBACK))


def build_receipt(user: User, plan: PricingPlan) -> dict[str, Any]:
    "Чек 54-ФЗ для YooKassa: один товар-услуга на сумму тарифа."
    return {
        "customer": build_customer(user),
        "items": [
            {
                "description": plan.name[:YOOKASSA_ITEM_DESCRIPTION_MAX_LEN],
                "quantity": YOOKASSA_RECEIPT_QUANTITY,
                "amount": {
                    "value": f"{plan.price_kopecks / KOPECKS_PER_RUBLE:.2f}",
                    "currency": YOOKASSA_CURRENCY,
                },
                "vat_code": DEFAULT_VAT_CODE,
                "payment_subject": YOOKASSA_PAYMENT_SUBJECT_SERVICE,
                "payment_mode": YOOKASSA_PAYMENT_MODE_FULL,
            }
        ],
    }


def build_customer(user: User) -> dict[str, Any]:
    "Строит объект из входных данных."
    if user.email:
        return {"email": user.email}
    if user.phone:
        digits = re.sub(r"\D", "", user.phone)
        if digits:
            return {"phone": digits}
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Для оплаты нужен email или телефон в профиле",
    )
