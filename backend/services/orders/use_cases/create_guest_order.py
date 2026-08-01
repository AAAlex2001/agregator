"Use case: create guest order."
from fastapi import BackgroundTasks, UploadFile

from models.account import Account
from models.order import Order
from schemas.guest_order import GuestOrderRequest
from schemas.order import OrderCreate
from services.orders.use_cases.create_order_with_files import CreateOrderWithFilesUseCase
from services.registration.notifier import RegistrationNotifier
from services.registration.use_cases.register_guest_customer import RegisterGuestCustomerUseCase


class CreateGuestOrderUseCase:
    """Заявка с лендинга: заводит заказчика без пароля, публикует заказ с файлами и шлёт код на почту.

    Документы формы (проект договора, ТЗ) кладутся в категорию «иное»: остальные категории
    рассчитаны на один файл, а в форме одна общая корзина вложений.
    """

    def __init__(
        self,
        register_customer: RegisterGuestCustomerUseCase,
        create_order: CreateOrderWithFilesUseCase,
        notifier: RegistrationNotifier,
    ) -> None:
        self.register_customer = register_customer
        self.create_order = create_order
        self.notifier = notifier

    async def execute(
        self,
        data: GuestOrderRequest,
        documents: list[UploadFile],
        background_tasks: BackgroundTasks,
    ) -> tuple[Account, Order]:
        "Запускает основной сценарий use case."
        account = await self.register_customer.execute(data.customer)
        order = await self.create_order.execute(
            self.build_order_data(data, account.id),
            technical=[],
            contract=[],
            company=[],
            other=documents,
            current_user_id=account.id,
        )
        await self.notifier.schedule_confirmation_email(account, background_tasks)
        return account, order

    @staticmethod
    def build_order_data(data: GuestOrderRequest, customer_id: int) -> OrderCreate:
        "Строит объект из входных данных."
        return OrderCreate(
            title=data.title,
            comment=data.comment,
            customer_id=customer_id,
            sum_amount=data.sum_amount,
            start_date=data.start_date,
            deadline=data.deadline,
            responses_deadline=data.responses_deadline,
            work_type=data.work_type,
            details=data.details,
        )
