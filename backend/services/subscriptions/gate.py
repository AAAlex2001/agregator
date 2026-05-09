from datetime import datetime, timezone

from fastapi import HTTPException, status

from models.pricing import SubscriptionKind, SubscriptionStatus, UserSubscription
from services.platform_settings import PlatformSettingsService
from services.subscriptions.repository import SubscriptionRepository


class SubscriptionAccess:
    "Гейт подписки эксперта на отклики: проверки доступа + списание/восстановление слотов SINGLE-тарифа."

    def __init__(self, repo: SubscriptionRepository, settings: PlatformSettingsService):
        self.repo = repo
        self.settings = settings

    async def require_for_response(self, user_id: int) -> UserSubscription | None:
        "В бесплатном режиме отклик разрешён без подписки — возвращает None."
        if not await self.settings.is_paid_responses_enabled():
            return None

        now = datetime.now(timezone.utc)
        await self.repo.expire_stale(user_id, now)
        await self.repo.flush()

        subscription = await self.repo.find_active_for_user(user_id)
        if subscription is None:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Нет активной подписки. Выберите тариф, чтобы откликаться на заказы.",
            )
        if subscription.kind == SubscriptionKind.SINGLE and (subscription.responses_remaining or 0) <= 0:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Разовый отклик уже использован. Оформите тариф, чтобы откликаться дальше.",
            )
        if subscription.expires_at is not None and subscription.expires_at <= now:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Срок подписки истёк. Продлите доступ.",
            )
        return subscription

    async def consume_for_response(self, subscription: UserSubscription) -> None:
        if subscription.kind != SubscriptionKind.SINGLE:
            return
        remaining = (subscription.responses_remaining or 0) - 1
        subscription.responses_remaining = max(0, remaining)
        if remaining <= 0:
            subscription.status = SubscriptionStatus.USED
        await self.repo.flush()

    async def restore_response_slot(self, user_id: int) -> None:
        "Возвращает разовый отклик: при отзыве экспертом или авто-отклонении (не ручном)."
        if not await self.settings.is_paid_responses_enabled():
            return
        subscription = await self.repo.find_latest_consumed_single(user_id)
        if subscription is None:
            return
        subscription.responses_remaining = 1
        subscription.status = SubscriptionStatus.ACTIVE
        await self.repo.flush()
