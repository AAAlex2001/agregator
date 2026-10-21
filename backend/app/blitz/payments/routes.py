"""Оплата этапа картой в кабинете заказчика-физлица."""

from fastapi import APIRouter, Depends

from app.auth.sessions.dependencies import require_user
from app.blitz.billing.schemas import PaymentLinkSchema
from app.blitz.orders.dependencies import get_locked_order
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.schemas import OrderSchema
from app.blitz.orders.services.presenter import details
from app.blitz.payments.dependencies import get_create_card_payment_usecase, get_sync_card_payments_usecase
from app.blitz.payments.services.usecases.create_card_payment import CreateCardPaymentUseCase
from app.blitz.payments.services.usecases.sync_card_payments import SyncCardPaymentsUseCase
from models.account import Account

router = APIRouter(tags=["blitz"])


@router.post("/orders/{order_id}/payment")
async def create_card_payment(
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: CreateCardPaymentUseCase = Depends(get_create_card_payment_usecase),
) -> PaymentLinkSchema:
    """Ссылка на страницу оплаты текущего этапа."""

    return PaymentLinkSchema(confirmation_url=await usecase.execute(user, order))


@router.post("/orders/{order_id}/payment/refresh")
async def refresh_card_payments(
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: SyncCardPaymentsUseCase = Depends(get_sync_card_payments_usecase),
) -> OrderSchema:
    """Проверить оплату после возврата со страницы ЮKassa."""

    return details(await usecase.execute(order), user)
