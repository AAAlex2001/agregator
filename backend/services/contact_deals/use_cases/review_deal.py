from fastapi import HTTPException, status

from models.contact_deal import ContactDealStatus
from models.review import Review
from services.contact_deals.policies import ContactDealPolicy
from services.contact_deals.repository import ContactDealRepository
from services.contact_deals.use_cases.notify_event import (
    NotifyContactAccessEventUseCase,
)

REVIEWABLE_STATUSES = {
    ContactDealStatus.PAYMENT_REPORTED,
    ContactDealStatus.PAYMENT_REJECTED,
    ContactDealStatus.CONTACTS_RELEASED,
}


class ReviewContactDealUseCase:
    def __init__(
        self,
        repository: ContactDealRepository,
        policy: ContactDealPolicy,
        notifier: NotifyContactAccessEventUseCase | None = None,
    ) -> None:
        self.repository = repository
        self.policy = policy
        self.notifier = notifier

    async def execute(
        self,
        deal_id: int,
        buyer_id: int,
        rating: int,
        comment: str,
    ) -> Review:
        deal = await self.policy.require_deal(deal_id, for_update=True)
        self.policy.require_buyer(deal, buyer_id)
        expert = await self.policy.require_expert(
            deal.seller_id,
            for_update=True,
        )
        existing = await self.repository.find_review(deal.id, buyer_id)
        if existing is not None:
            return existing
        if deal.status not in REVIEWABLE_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Отзыв можно оставить после загрузки чека об оплате",
            )

        review = Review(
            contact_deal_id=deal.id,
            customer_id=buyer_id,
            expert_id=deal.seller_id,
            rating=rating,
            comment=comment.strip(),
        )
        await self.repository.add_review(review)
        await self.repository.flush()

        count, average = await self.repository.review_stats(expert.id)
        expert.review_count = count
        expert.rating = round(average, 1) if average is not None else None
        await self.repository.flush()
        if self.notifier is not None:
            await self.notifier.execute(
                deal.seller_id,
                "Покупатель оставил отзыв",
                f"Новая оценка по сделке доступа к контактам: {rating} из 5.",
            )
        return review
