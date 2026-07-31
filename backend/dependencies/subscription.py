"Зависимости и хелперы доступа к платным функциям эксперта: проверка роли/подписки + списание слотов тарифа."
from datetime import UTC, datetime

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.account import UserRole
from services.platform_settings import PlatformSettingsService
from services.subscriptions import SubscriptionAccess, SubscriptionRepository


async def require_active_subscription(
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> int:
    "Пускает только при активной (не истёкшей) подписке, иначе 402."
    repo = SubscriptionRepository(db)
    await repo.expire_stale(user_id, datetime.now(UTC))
    await repo.flush()
    if await repo.find_active_for_user(user_id) is None:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Нужна активная подписка для доступа к инструменту.",
        )
    return user_id


async def require_expert_tool_access(
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> int:
    "Доступ к инструментам экспертов (Оценка крепи / Оценка опасности): роль EXPERT (403); активная подписка (402) только при включённом платном режиме инструментов."
    repo = SubscriptionRepository(db)
    user = await repo.find_user(user_id)
    if user is None or user.role != UserRole.EXPERT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Инструмент доступен только экспертам.",
        )
    if not await PlatformSettingsService(db).is_paid_tools_enabled():
        return user_id
    await repo.expire_stale(user_id, datetime.now(UTC))
    await repo.flush()
    if await repo.find_active_for_user(user_id) is None:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Нужна активная подписка для доступа к инструменту.",
        )
    return user_id


async def consume_tool_slot(user_id: int, db: AsyncSession) -> None:
    "Списывает слот разового тарифа за формирование отчёта в инструменте. MONTHLY/YEARLY — безлимит, бесплатный режим — без списания."
    access = SubscriptionAccess(SubscriptionRepository(db), PlatformSettingsService(db))
    subscription = await access.require_for_tool(user_id)
    if subscription is not None:
        await access.consume_for_response(subscription)
