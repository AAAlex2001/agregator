"""Этапы оплаты: аванс 50 % после договора и остаток после готового заключения.

Каждая поступившая оплата зачитывается в paid_amount, даже если пришла по старой ссылке.
Остаток — цена минус оплаченное: если администратор поменял цену после аванса, сумма к оплате
пересчитается сама. Заявка сдвигается, когда оплачен текущий этап.
"""

from decimal import ROUND_HALF_UP, Decimal

from app.blitz.billing.models import PaymentStage
from app.blitz.orders.models import Actor, BlitzOrder, OrderStatus
from app.core.money import format_rub

KOPECK = Decimal("0.01")
ZERO = Decimal(0)

STAGE_BY_STATUS = {
    OrderStatus.CONTRACT: PaymentStage.ADVANCE,
    OrderStatus.CONCLUSION_READY: PaymentStage.FINAL,
}

STAGE_TITLES = {
    PaymentStage.ADVANCE: "Аванс 50 %",
    PaymentStage.FINAL: "Остаток",
}


def current_stage(order: BlitzOrder) -> PaymentStage | None:
    """Этап, который заказчик оплачивает сейчас, или None."""

    return STAGE_BY_STATUS.get(OrderStatus(order.status))


def advance_of(price: Decimal) -> Decimal:
    """Половина цены, округлённая до копейки. Нечётная копейка уходит в остаток."""

    return (price / 2).quantize(KOPECK, rounding=ROUND_HALF_UP)


def amount_due(order: BlitzOrder, stage: PaymentStage) -> Decimal:
    """Сколько заплатить за этап с учётом уже оплаченного."""

    target = advance_of(order.price) if stage == PaymentStage.ADVANCE else order.price

    return max(target - order.paid_amount, ZERO)


def accept_payment(order: BlitzOrder, stage: PaymentStage, amount: Decimal) -> str | None:
    """Зачесть оплату и, если оплачен текущий этап, сдвинуть заявку.

    Возвращает текст для эксперта или None, если заявка не сдвинулась.
    """

    order.paid_amount += amount

    if current_stage(order) != stage or amount_due(order, stage) > ZERO:
        return None

    if stage == PaymentStage.ADVANCE:
        order.move_to(OrderStatus.IN_PROGRESS, Actor.SYSTEM, f"Аванс {format_rub(amount)} оплачен")
        return "Заказчик оплатил аванс, можно приступать к работе"

    order.move_to(OrderStatus.PAID, Actor.SYSTEM, f"Остаток {format_rub(amount)} оплачен")

    return "Заказчик оплатил остаток: подпишите заключение ЭЦП и отправьте его"
