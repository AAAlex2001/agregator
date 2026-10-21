"""Работа по заявке: сценарии шагов эксперта и заказчика."""

from fastapi import Depends

from app.blitz.documents.services.storage import OrderFiles
from app.blitz.notifications import BlitzNotifier, get_blitz_notifier
from app.blitz.orders.dependencies import get_order_repository
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.work.services.usecases.accept_work import AcceptWorkUseCase
from app.blitz.work.services.usecases.mark_conclusion_ready import MarkConclusionReadyUseCase
from app.blitz.work.services.usecases.send_conclusion import SendConclusionUseCase
from app.blitz.work.services.usecases.send_remarks import SendRemarksUseCase
from app.blitz.work.services.usecases.send_revision import SendRevisionUseCase


def get_send_remarks_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> SendRemarksUseCase:
    """Замечания эксперта."""

    return SendRemarksUseCase(orders, OrderFiles(), notifier)


def get_send_revision_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> SendRevisionUseCase:
    """Исправления заказчика."""

    return SendRevisionUseCase(orders, OrderFiles(), notifier)


def get_mark_conclusion_ready_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> MarkConclusionReadyUseCase:
    """Заключение готово."""

    return MarkConclusionReadyUseCase(orders, notifier)


def get_send_conclusion_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> SendConclusionUseCase:
    """Отправка заключения."""

    return SendConclusionUseCase(orders, OrderFiles(), notifier)


def get_accept_work_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> AcceptWorkUseCase:
    """Приёмка работы."""

    return AcceptWorkUseCase(orders, notifier)
