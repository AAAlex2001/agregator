"""Заявки: репозиторий, сценарии и заявка по id из пути с проверкой доступа."""

from datetime import date

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.sessions.dependencies import require_user
from app.blitz.audit.services.repo import AuditRepository
from app.blitz.documents.services.storage import OrderFiles
from app.blitz.notifications import BlitzNotifier, get_blitz_notifier
from app.blitz.orders.models import BlitzOrder
from app.blitz.orders.services.access import can_view
from app.blitz.orders.services.exceptions import OrderNotFoundError
from app.blitz.orders.services.repo import OrderRepository
from app.blitz.orders.services.usecases.accept_order import AcceptOrderUseCase
from app.blitz.orders.services.usecases.assign_expert import AssignExpertUseCase
from app.blitz.orders.services.usecases.cancel_order import CancelOrderUseCase
from app.blitz.orders.services.usecases.create_order import CreateOrderUseCase
from app.blitz.orders.services.usecases.delete_order import DeleteOrderUseCase
from app.blitz.orders.services.usecases.set_order_status import SetOrderStatusUseCase
from app.core.database import get_db
from models.account import Account, UserRole


def get_order_repository(db: AsyncSession = Depends(get_db)) -> OrderRepository:
    """Репозиторий заявок с сессией текущего запроса."""

    return OrderRepository(db)


def get_audit_repository(db: AsyncSession = Depends(get_db)) -> AuditRepository:
    """Аудиторы и руководители групп с сессией текущего запроса."""

    return AuditRepository(db)


async def get_audit_lead(
    user: Account = Depends(require_user),
    audits: AuditRepository = Depends(get_audit_repository),
) -> bool:
    """Руководит ли пользователь аудиторскими группами."""

    return user.role == UserRole.EXPERT and await audits.is_lead(user.id)


async def get_viewed_order(
    order_id: int,
    user: Account = Depends(require_user),
    audit_lead: bool = Depends(get_audit_lead),
    orders: OrderRepository = Depends(get_order_repository),
) -> BlitzOrder:
    """Заявка, которую пользователю можно смотреть. Чужая выглядит как несуществующая."""

    order = await orders.get(order_id)
    if order is None or not can_view(order, user, date.today(), audit_lead):
        raise OrderNotFoundError

    return order


async def get_locked_order(
    order_id: int,
    user: Account = Depends(require_user),
    audit_lead: bool = Depends(get_audit_lead),
    orders: OrderRepository = Depends(get_order_repository),
) -> BlitzOrder:
    """Заявка для действия: строка заблокирована до конца запроса."""

    order = await orders.get_for_update(order_id)
    if order is None or not can_view(order, user, date.today(), audit_lead):
        raise OrderNotFoundError

    return order


async def get_admin_order(
    order_id: int,
    orders: OrderRepository = Depends(get_order_repository),
) -> BlitzOrder:
    """Любая заявка для админки, заблокированная до конца запроса."""

    order = await orders.get_for_update(order_id)
    if order is None:
        raise OrderNotFoundError

    return order


def get_create_order_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> CreateOrderUseCase:
    """Подача заявки."""

    return CreateOrderUseCase(orders, OrderFiles(), notifier)


def get_accept_order_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> AcceptOrderUseCase:
    """Эксперт берёт заявку."""

    return AcceptOrderUseCase(orders, notifier)


def get_cancel_order_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> CancelOrderUseCase:
    """Отмена заявки."""

    return CancelOrderUseCase(orders, notifier)


def get_set_order_status_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    audits: AuditRepository = Depends(get_audit_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> SetOrderStatusUseCase:
    """Смена статуса администратором."""

    return SetOrderStatusUseCase(orders, audits, notifier)


def get_assign_expert_usecase(
    orders: OrderRepository = Depends(get_order_repository),
    audits: AuditRepository = Depends(get_audit_repository),
    notifier: BlitzNotifier = Depends(get_blitz_notifier),
) -> AssignExpertUseCase:
    """Назначение исполнителя администратором."""

    return AssignExpertUseCase(orders, audits, notifier)


def get_delete_order_usecase(
    orders: OrderRepository = Depends(get_order_repository),
) -> DeleteOrderUseCase:
    """Удаление заявки администратором."""

    return DeleteOrderUseCase(orders, OrderFiles())
