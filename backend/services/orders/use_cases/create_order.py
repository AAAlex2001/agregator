"Use case: create order."
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from models.order import Order, OrderBadge, OrderWorkType
from schemas.order import OrderCreate
from services.directions.registry import get_direction
from services.email import SendNewOrderEmailUseCase
from services.notifications import CreateNewOrderNotificationUseCase
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
        create_new_order_notification: CreateNewOrderNotificationUseCase | None = None,
    ) -> None:
        self.repo = repo
        self.validator = validator
        self.send_new_order_email = send_new_order_email
        self.create_new_order_notification = create_new_order_notification

    async def execute(self, data: OrderCreate, current_user_id: int) -> Order:
        "Запускает основной сценарий use case."
        await self.validator.ensure_user_can_create_order(data.customer_id, current_user_id)
        self.validator.ensure_requirements_selected(data.requires_expert, data.requires_license)
        await self.validator.ensure_customer_exists(data.customer_id)
        validated_details = self.validator.validate_direction_details(data.work_type, data.details)

        order = self.build_entity(data)
        order.badges = self.build_badges(data)
        await self.repo.add(order)
        await self.flush_or_reject()

        direction = get_direction(data.work_type.value)
        if direction is not None and validated_details is not None:
            await self.repo.add_details(
                direction.details_model(order_id=order.id, **validated_details.model_dump())
            )
            await self.flush_or_reject()

        created = await self.repo.get_by_id(order.id)
        if created is None:
            raise RuntimeError("Order disappeared after insert")
        if self.send_new_order_email is not None:
            await self.send_new_order_email.execute(created.id)
        if self.create_new_order_notification is not None:
            await self.create_new_order_notification.execute(created)
        return created

    def build_entity(self, data: OrderCreate) -> Order:
        "Строит объект из входных данных."
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
            work_type=data.work_type,
            status=data.status,
        )
        OrderDocumentsService.write(order, data.documents)
        return order

    def build_badges(self, data: OrderCreate) -> list[OrderBadge]:
        "Строит объект из входных данных."
        if data.work_type != OrderWorkType.EXPERTISE:
            return []
        return [
            OrderBadge(text=badge.text, variant=badge.variant)
            for badge in data.badges
        ]

    async def flush_or_reject(self) -> None:
        "Сбрасывает изменения в БД или бросает 400 при конфликте."
        try:
            await self.repo.flush()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Некорректные данные заказа",
            )
