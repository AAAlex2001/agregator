from datetime import date
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from models.order import OrderWorkType
from schemas.guest_order import GuestOrderCustomer, GuestOrderRequest
from services.orders.use_cases.create_guest_order import CreateGuestOrderUseCase


def build_request(work_type: OrderWorkType = OrderWorkType.RESEARCH) -> GuestOrderRequest:
    return GuestOrderRequest(
        customer=GuestOrderCustomer(
            first_name="Иван",
            last_name="Петров",
            phone="+7 999 111-22-33",
            email="customer@example.com",
        ),
        work_type=work_type,
        title="Исследование сварных швов",
        comment="Нужен отчёт по ГОСТ",
        sum_amount=150000,
        start_date=date(2026, 9, 1),
        deadline=date(2026, 10, 1),
        details={"executor_requirements": ["Кандидат наук"], "needs_site_visit": True},
    )


def build_use_case(account_id: int = 7) -> tuple[CreateGuestOrderUseCase, MagicMock, MagicMock, MagicMock]:
    account = SimpleNamespace(id=account_id, email="customer@example.com")
    order = SimpleNamespace(id=42, public_id="order-uuid")
    register = MagicMock()
    register.execute = AsyncMock(return_value=account)
    create_order = MagicMock()
    create_order.execute = AsyncMock(return_value=order)
    notifier = MagicMock()
    notifier.schedule_confirmation_email = AsyncMock()
    use_case = CreateGuestOrderUseCase(
        register_customer=register,
        create_order=create_order,
        notifier=notifier,
    )
    return use_case, register, create_order, notifier


class TestCreateGuestOrder:
    @pytest.mark.asyncio
    async def test_registers_customer_then_creates_order(self):
        use_case, register, create_order, notifier = build_use_case()
        background_tasks = MagicMock()

        account, order = await use_case.execute(build_request(), [], background_tasks)

        register.execute.assert_awaited_once()
        create_order.execute.assert_awaited_once()
        notifier.schedule_confirmation_email.assert_awaited_once_with(account, background_tasks)
        assert order.public_id == "order-uuid"

    @pytest.mark.asyncio
    async def test_order_belongs_to_created_account(self):
        "Заявка создаётся от имени только что зарегистрированного заказчика."
        use_case, _, create_order, _ = build_use_case(account_id=99)

        await use_case.execute(build_request(), [], MagicMock())

        order_data = create_order.execute.await_args.args[0]
        assert order_data.customer_id == 99
        assert create_order.execute.await_args.kwargs["current_user_id"] == 99

    @pytest.mark.asyncio
    async def test_direction_details_passed_through(self):
        use_case, _, create_order, _ = build_use_case()

        await use_case.execute(build_request(), [], MagicMock())

        order_data = create_order.execute.await_args.args[0]
        assert order_data.work_type == OrderWorkType.RESEARCH
        assert order_data.details == {
            "executor_requirements": ["Кандидат наук"],
            "needs_site_visit": True,
        }

    @pytest.mark.asyncio
    async def test_title_and_comment_mapped_to_order(self):
        use_case, _, create_order, _ = build_use_case()

        await use_case.execute(build_request(OrderWorkType.LABORATORY), [], MagicMock())

        order_data = create_order.execute.await_args.args[0]
        assert order_data.title == "Исследование сварных швов"
        assert order_data.comment == "Нужен отчёт по ГОСТ"
        assert order_data.sum_amount == 150000

    @pytest.mark.asyncio
    async def test_documents_go_to_other_category(self):
        "Категории ТЗ/договор/карточка держат по одному файлу — общая корзина формы идёт в «иное»."
        use_case, _, create_order, _ = build_use_case()
        documents = [SimpleNamespace(filename="tz.pdf"), SimpleNamespace(filename="dogovor.docx")]

        await use_case.execute(build_request(), documents, MagicMock())

        kwargs = create_order.execute.await_args.kwargs
        assert kwargs["other"] == documents
        assert kwargs["technical"] == []
        assert kwargs["contract"] == []
