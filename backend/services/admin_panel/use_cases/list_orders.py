"Список заказов для админки."

from models.order import OrderStatus, OrderWorkType
from schemas.admin_panel import AdminOrderListOut, AdminOrderOut
from services.admin_panel.repository import AdminPanelRepository
from services.admin_panel.use_cases.list_accounts import display_name


class ListOrdersUseCase:
    "Страница заказов с фильтрами по статусу и направлению и поиском."

    def __init__(self, repo: AdminPanelRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        status: OrderStatus | None,
        work_type: OrderWorkType | None,
        query: str | None,
        skip: int,
        limit: int,
    ) -> AdminOrderListOut:
        "Заказы и общее количество под фильтры. Сумма в БД хранится в копейках."
        orders, total = await self.repo.list_orders(status, work_type, query, skip, limit)
        items = [
            AdminOrderOut(
                id=order.id,
                title=order.title,
                company=order.company,
                work_type=order.work_type.value,
                status=order.status.value,
                sum_rub=order.sum_amount // 100,
                deadline=order.deadline,
                customer_name=display_name(order.customer),
                expert_name=display_name(order.assigned_expert) if order.assigned_expert else None,
                created_at=order.created_at,
            )
            for order in orders
        ]
        return AdminOrderListOut(items=items, total=total)
