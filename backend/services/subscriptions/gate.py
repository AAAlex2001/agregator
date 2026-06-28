"Сервисный модуль: gate."
from datetime import UTC, datetime

from fastapi import HTTPException, status

from models.pricing import SubscriptionKind, SubscriptionStatus, UserSubscription
from services.platform_settings import PlatformSettingsService
from services.subscriptions.repository import SubscriptionRepository


class SubscriptionAccess:
    "Гейт подписки эксперта на отклики и инструменты: проверки доступа + списание/восстановление слотов SINGLE-тарифа."

    def __init__(self, repo: SubscriptionRepository, settings: PlatformSettingsService) -> None:
        self.repo = repo
        self.settings = settings

    async def require_for_response(self, user_id: int) -> UserSubscription | None:
        "Гейт отклика на заказ. В бесплатном режиме возвращает None."
        enabled = await self.settings.is_paid_responses_enabled()
        return await self.require_paid_access(user_id, enabled, "откликаться на заказы")

    async def require_for_tool(self, user_id: int) -> UserSubscription | None:
        "Гейт инструментов эксперта (Оценка крепи / Оценка опасности). В бесплатном режиме возвращает None."
        enabled = await self.settings.is_paid_tools_enabled()
        return await self.require_paid_access(user_id, enabled, "пользоваться инструментом")

    async def require_paid_access(
        self, user_id: int, enabled: bool, action_phrase: str
    ) -> UserSubscription | None:
        "Проверка активной подписки. При выключенном платном режиме доступ свободный — возвращает None."
        if not enabled:
            return None

        now = datetime.now(UTC)
        await self.repo.expire_stale(user_id, now)
        await self.repo.flush()

        subscription = await self.repo.find_active_for_user(user_id)
        if subscription is None:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Нет активной подписки. Выберите тариф, чтобы {action_phrase}.",
            )
        if subscription.kind == SubscriptionKind.SINGLE and (subscription.responses_remaining or 0) <= 0:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Разовый доступ уже использован. Оформите тариф, чтобы продолжить.",
            )
        if subscription.expires_at is not None and subscription.expires_at <= now:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Срок подписки истёк. Продлите доступ.",
            )
        return subscription

    async def consume_for_response(self, subscription: UserSubscription) -> None:
        "Поглощает (помечает использованным) код."
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
