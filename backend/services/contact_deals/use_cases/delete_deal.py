from datetime import UTC, datetime

from services.contact_deals.policies import ContactDealPolicy
from services.contact_deals.repository import ContactDealRepository
from services.contact_deals.use_cases.notify_event import (
    NotifyContactAccessEventUseCase,
)


class DeleteContactDealUseCase:
    def __init__(
        self,
        repository: ContactDealRepository,
        policy: ContactDealPolicy,
        notifier: NotifyContactAccessEventUseCase | None = None,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.notifier = notifier

    async def execute(self, deal_id: int, buyer_id: int) -> None:
        deal = await self.policy.require_deal(deal_id, for_update=True)
        self.policy.require_buyer(deal, buyer_id)
        if deal.buyer_deleted_at is not None:
            return
        deal.buyer_deleted_at = datetime.now(UTC)
        await self.repository.flush()
        if self.notifier is not None:
            await self.notifier.execute(
                deal.seller_id,
                "Покупатель удалил заявку на контакты",
                "Сделка скрыта у покупателя. Договор и история действий сохранены.",
            )
