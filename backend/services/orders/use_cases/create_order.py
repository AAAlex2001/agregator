from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from models.order import Order, OrderBadge
from services.email import SendNewOrderEmailUseCase
from services.orders.documents import OrderDocumentsService
from services.orders.repository import OrderRepository
from services.orders.validators import OrderValidator
from schemas.order import OrderCreate


class CreateOrderUseCase:
    "Создаёт заказ без файлов. С файлами — отдельный use case."

    def __init__(
        self,
        repo: OrderRepository,
        validator: OrderValidator,
        send_new_order_email: SendNewOrderEmailUseCase | None = None,
    ):
        self.repo = repo
        self.validator = validator
        self.send_new_order_email = send_new_order_email

    async def execute(self, data: OrderCreate, current_user_id: int) -> Order:
        await self.validator.ensure_user_can_create_order(data.customer_id, current_user_id)
        await self.validator.ensure_customer_exists(data.customer_id)

        order = self.build_entity(data)
        await self.repo.add(order)
        await self.flush_or_reject()

        if data.badges:
            await self.repo.add_badges(self.build_badges(order.id, data))

        created = await self.repo.get_by_id(order.id)
        if self.send_new_order_email is not None:
            await self.send_new_order_email.execute(created.id)
        return created

    def build_entity(self, data: OrderCreate) -> Order:
        order = Order(
            title=data.title,
            company=data.company,
            comment=data.comment,
            customer_id=data.customer_id,
            sum_amount=data.sum_amount,
            deadline=data.deadline,
            responses_deadline=data.responses_deadline,
            status=data.status,
        )
        OrderDocumentsService.write(order, data.documents)
        return order

    def build_badges(self, order_id: int, data: OrderCreate) -> list[OrderBadge]:
        return [
            OrderBadge(order_id=order_id, text=badge.text, variant=badge.variant)
            for badge in data.badges
        ]

    async def flush_or_reject(self) -> None:
        try:
            await self.repo.flush()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Некорректные данные заказа",
            )
