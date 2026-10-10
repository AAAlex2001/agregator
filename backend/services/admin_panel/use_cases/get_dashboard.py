"Сводка платформы для дашборда админки."

from datetime import UTC, datetime, time, timedelta

from models.account import Account
from models.order import Order
from models.response import OrderResponse
from schemas.admin_panel import DailyCountOut, DashboardCounterOut, DashboardOut
from services.admin_panel.repository import AdminPanelRepository, TrackedModel

DAYS = 30


class GetDashboardUseCase:
    "Собирает счётчики, динамику по дням и распределения по ролям и статусам."

    def __init__(self, repo: AdminPanelRepository) -> None:
        self.repo = repo

    async def counter(self, model: TrackedModel) -> DashboardCounterOut:
        "Всего записей и сколько создано за последние 7 и 30 дней."
        now = datetime.now(UTC)
        return DashboardCounterOut(
            total=await self.repo.count_created(model),
            week=await self.repo.count_created(model, now - timedelta(days=7)),
            month=await self.repo.count_created(model, now - timedelta(days=30)),
        )

    async def daily(self, model: TrackedModel) -> list[DailyCountOut]:
        "Записи по дням за последние 30 дней, дни без записей — с нулём."
        first_day = datetime.now(UTC).date() - timedelta(days=DAYS - 1)
        counts = await self.repo.count_created_by_day(model, datetime.combine(first_day, time.min, UTC))
        days = [first_day + timedelta(days=offset) for offset in range(DAYS)]
        return [DailyCountOut(date=day, count=counts.get(day, 0)) for day in days]

    async def execute(self) -> DashboardOut:
        "Полная сводка для дашборда."
        return DashboardOut(
            users=await self.counter(Account),
            orders=await self.counter(Order),
            responses=await self.counter(OrderResponse),
            users_daily=await self.daily(Account),
            orders_daily=await self.daily(Order),
            responses_daily=await self.daily(OrderResponse),
            users_by_role=await self.repo.count_accounts_by_role(),
            orders_by_status=await self.repo.count_orders_by_status(),
            responses_by_status=await self.repo.count_responses_by_status(),
        )
