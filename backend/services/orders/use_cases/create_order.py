from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from models.order import Order, OrderBadge
from schemas.order import OrderCreate
from services.email import SendNewOrderEmailUseCase
from services.orders.documents import OrderDocumentsService
from services.orders.repository import OrderRepository
from services.orders.validators import OrderValidator


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
        self.validator.ensure_requirements_selected(data.requires_expert, data.requires_license)
        await self.validator.ensure_customer_exists(data.customer_id)

        order = self.build_entity(data)
        order.badges = self.build_badges(data)
        await self.repo.add(order)
        await self.flush_or_reject()

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
            start_date=data.start_date,
            deadline=data.deadline,
            responses_deadline=data.responses_deadline,
            requires_expert=data.requires_expert,
            requires_license=data.requires_license,
            status=data.status,
        )
        OrderDocumentsService.write(order, data.documents)
        return order

    def build_badges(self, data: OrderCreate) -> list[OrderBadge]:
        return [
            OrderBadge(text=badge.text, variant=badge.variant)
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
