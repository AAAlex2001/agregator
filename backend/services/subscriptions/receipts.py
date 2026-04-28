import os
import re

from fastapi import HTTPException, status

from models.pricing import PricingPlan
from models.user import User


# Код НДС из env: 1 — без НДС, 2 — 0%, 3 — 10%, 4 — 20%, 5 — 10/110, 6 — 20/120.
DEFAULT_VAT_CODE = int(os.getenv("YOOKASSA_VAT_CODE", "1"))


def build_receipt(user: User, plan: PricingPlan) -> dict:
    "Чек 54-ФЗ для YooKassa: один товар-услуга на сумму тарифа."
    return {
        "customer": build_customer(user),
        "items": [
            {
                "description": plan.name[:128],
                "quantity": "1.00",
                "amount": {
                    "value": f"{plan.price_kopecks / 100:.2f}",
                    "currency": "RUB",
                },
                "vat_code": DEFAULT_VAT_CODE,
                "payment_subject": "service",
                "payment_mode": "full_payment",
            }
        ],
    }


def build_customer(user: User) -> dict:
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
