"Зависимость доступа к платным инструментам: требует активную подписку."
from datetime import UTC, datetime

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.user import UserRole
from services.subscriptions import SubscriptionRepository


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


async def require_expert_subscription(
    user_id: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> int:
    "Инструмент для экспертов: роль EXPERT (403) + активная подписка (402)."
    repo = SubscriptionRepository(db)
    user = await repo.find_user(user_id)
    if user is None or user.role != UserRole.EXPERT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Инструмент доступен только экспертам.",
        )
    await repo.expire_stale(user_id, datetime.now(UTC))
    await repo.flush()
    if await repo.find_active_for_user(user_id) is None:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Нужна активная подписка для доступа к инструменту.",
        )
    return user_id
