"""Оплата картой: репозиторий, клиент ЮKassa и сценарии."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.notifications import BlitzNotifier, get_blitz_notifier
from app.blitz.orders.dependencies import get_order_repository
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.payments.services.repo import CardPaymentRepository
from app.blitz.payments.services.usecases.apply_card_payment import ApplyCardPaymentUseCase
from app.blitz.payments.services.usecases.apply_webhook_payment import ApplyWebhookPaymentUseCase
from app.blitz.payments.services.usecases.create_card_payment import CreateCardPaymentUseCase
from app.blitz.payments.services.usecases.sync_card_payments import SyncCardPaymentsUseCase
from app.core.database import get_db
from app.core.yookassa import YooKassaClient, get_yookassa_client


def get_card_payment_repository(db: AsyncSession = Depends(get_db)) -> CardPaymentRepository:
    """Репозиторий платежей картой с сессией текущего запроса."""

    return CardPaymentRepository(db)


def get_create_card_payment_usecase(
    payments: CardPaymentRepository = Depends(get_card_payment_repository),
    gateway: YooKassaClient = Depends(get_yookassa_client),
) -> CreateCardPaymentUseCase:
    """Ссылка на оплату картой."""

    return CreateCardPaymentUseCase(payments, gateway)


def get_apply_card_payment_usecase(
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> ApplyCardPaymentUseCase:
    """Зачёт оплаты картой."""

    return ApplyCardPaymentUseCase(notifier)


def get_sync_card_payments_usecase(
    payments: CardPaymentRepository = Depends(get_card_payment_repository),
    gateway: YooKassaClient = Depends(get_yookassa_client),
    apply_payment: ApplyCardPaymentUseCase = Depends(get_apply_card_payment_usecase),
) -> SyncCardPaymentsUseCase:
    """Проверка оплаты по кнопке."""

    return SyncCardPaymentsUseCase(payments, gateway, apply_payment)


def get_apply_webhook_payment_usecase(
    payments: CardPaymentRepository = Depends(get_card_payment_repository),
    orders: OrderRepository = Depends(get_order_repository),
    apply_payment: ApplyCardPaymentUseCase = Depends(get_apply_card_payment_usecase),
) -> ApplyWebhookPaymentUseCase:
    """Зачёт оплаты из вебхука ЮKassa."""

    return ApplyWebhookPaymentUseCase(payments, orders, apply_payment)
