"""Аккаунт читателя публикаций: для чтения — если вошёл, для действий — обязателен."""

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user as require_account_id
from dependencies.auth import get_current_user_optional
from models.account import Account


async def get_current_user(
    account_id: int | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
) -> Account | None:
    """Действующий аккаунт читателя или None для гостя."""

    account = await db.get(Account, account_id) if account_id is not None else None
    return account if account and account.is_active else None


async def require_user(
    account_id: int = Depends(require_account_id),
    db: AsyncSession = Depends(get_db),
) -> Account:
    """Действующий аккаунт автора действия. Без сессии или отключённый — 401."""

    account = await db.get(Account, account_id)
    if account is None or not account.is_active:
        raise HTTPException(401, "Необходима авторизация")
    return account
