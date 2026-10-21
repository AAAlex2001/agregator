"""Договор: сценарий подписи."""

from fastapi import Depends

from app.blitz.contracts.services.usecases.sign_contract import SignContractUseCase
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.notifications import BlitzNotifier, get_blitz_notifier
from app.blitz.orders.dependencies import get_order_repository
from app.blitz.orders.services.repo import OrderRepository


def get_sign_contract_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> SignContractUseCase:
    """Подпись договора заказчиком."""

    return SignContractUseCase(orders, OrderFiles(), notifier)
