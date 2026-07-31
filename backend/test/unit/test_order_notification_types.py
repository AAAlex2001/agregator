from datetime import date
from types import SimpleNamespace
from unittest import IsolatedAsyncioTestCase, TestCase
from unittest.mock import AsyncMock, MagicMock, patch

from fastapi import HTTPException

from models.order import OrderWorkType
from models.account import UserRole
from schemas.settings import UpdateOrderNotificationsRequest
from services.email.use_cases.send_new_order_email import SendNewOrderEmailUseCase
from services.notifications.use_cases.create_new_order_notification import (
    CreateNewOrderNotificationUseCase,
)
from services.order_notification_types import (
    ENGINEERING_ORDER_NOTIFICATION_TYPES,
    notification_types_for_order,
)
from services.settings.use_cases.update_order_notifications import (
    UpdateOrderNotificationsUseCase,
)
from services.settings.validators import SettingsValidator


def make_order(work_type: OrderWorkType, badges: list[str] | None = None) -> SimpleNamespace:
    return SimpleNamespace(
        id=10,
        title="Диагностика объекта",
        company="Заказчик",
        comment="",
        sum_amount=100_000,
        deadline=date(2026, 8, 1),
        work_type=work_type,
        badges=[SimpleNamespace(text=code) for code in badges or []],
    )


def make_expert(user_id: int, subscriptions: list[str]) -> SimpleNamespace:
    return SimpleNamespace(
        id=user_id,
        first_name="Эксперт",
        last_name=None,
        expert_profile=SimpleNamespace(notify_order_types=subscriptions),
    )


class NotificationTypesForOrderTest(TestCase):
    def test_expertise_order_uses_badge_codes(self) -> None:
        order = make_order(OrderWorkType.EXPERTISE, ["Э1 КЛ/ТП", "Э2 ЗС"])

        assert notification_types_for_order(order) == {"Э1 КЛ/ТП", "Э2 ЗС"}

    def test_each_engineering_order_uses_its_work_type(self) -> None:
        work_types = (
            OrderWorkType.DESIGN_SURVEY,
            OrderWorkType.INSPECTION_TESTING,
            OrderWorkType.RESEARCH_LAB,
            OrderWorkType.OTHER,
        )
        for work_type in work_types:
            with self.subTest(work_type=work_type):
                order = make_order(work_type)
                assert notification_types_for_order(order) == {work_type.value}

    def test_settings_schema_accepts_all_engineering_types(self) -> None:
        data = UpdateOrderNotificationsRequest(
            order_types=[
                *ENGINEERING_ORDER_NOTIFICATION_TYPES,
                OrderWorkType.DESIGN_SURVEY.value,
            ]
        )

        assert data.order_types == list(ENGINEERING_ORDER_NOTIFICATION_TYPES)


class OrderNotificationUseCasesTest(IsolatedAsyncioTestCase):
    async def test_in_app_notification_matches_engineering_subscription(self) -> None:
        matching = make_expert(1, [OrderWorkType.DESIGN_SURVEY.value])
        unrelated = make_expert(2, [OrderWorkType.RESEARCH_LAB.value])
        repo = MagicMock()
        repo.list_experts_subscribed_to_order_types = AsyncMock(
            return_value=[matching, unrelated]
        )
        repo.list_all_experts = AsyncMock(return_value=[])
        repo.add = AsyncMock()
        repo.increment_unread = AsyncMock()
        repo.flush = AsyncMock()

        with patch(
            "services.notifications.use_cases.create_new_order_notification.Notification",
            SimpleNamespace,
        ):
            sent = await CreateNewOrderNotificationUseCase(repo).execute(
                make_order(OrderWorkType.DESIGN_SURVEY)
            )

        assert sent == 1
        repo.list_all_experts.assert_not_awaited()
        notification = repo.add.await_args.args[0]
        assert notification.user_id == matching.id
        assert notification.payload["badges"] == []
        repo.increment_unread.assert_awaited_once_with(matching.id)

    async def test_email_notification_matches_engineering_subscription(self) -> None:
        matching = make_expert(1, [OrderWorkType.INSPECTION_TESTING.value])
        unrelated = make_expert(2, [OrderWorkType.OTHER.value])
        repo = MagicMock()
        repo.find_order = AsyncMock(
            return_value=make_order(OrderWorkType.INSPECTION_TESTING)
        )
        repo.list_experts_subscribed_to_order_types = AsyncMock(
            return_value=[matching, unrelated]
        )
        repo.list_all_experts = AsyncMock(return_value=[])
        dispatcher = MagicMock()

        await SendNewOrderEmailUseCase(repo, dispatcher).execute(10)

        repo.list_all_experts.assert_not_awaited()
        dispatcher.notify.assert_called_once()
        assert dispatcher.notify.call_args.args[0].id == matching.id

    async def test_order_notification_settings_require_expert_role(self) -> None:
        account = make_expert(1, [])
        repo = MagicMock()
        repo.flush = AsyncMock()
        validator = MagicMock()
        validator.require_expert = AsyncMock(return_value=account)
        validator.require_expert_profile = MagicMock(return_value=account.expert_profile)

        result = await UpdateOrderNotificationsUseCase(repo, validator).execute(
            account.id,
            [OrderWorkType.OTHER.value],
        )

        validator.require_expert.assert_awaited_once_with(account.id)
        assert result is account
        assert account.expert_profile.notify_order_types == [OrderWorkType.OTHER.value]
        repo.flush.assert_awaited_once()

    async def test_customer_cannot_update_order_notification_settings(self) -> None:
        customer = SimpleNamespace(role=UserRole.CUSTOMER)
        repo = MagicMock()
        repo.find_user_by_id = AsyncMock(return_value=customer)

        caught_error: HTTPException | None = None
        try:
            await SettingsValidator(repo).require_expert(7)
        except HTTPException as error:
            caught_error = error

        assert caught_error is not None
        assert caught_error.status_code == 403
        assert caught_error.detail == "Доступно только эксперту"
