import secrets

from fastapi import Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user as require_account_id
from dependencies.auth import get_current_user_optional
from models.account import Account


async def get_current_user(
    account_id: int | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
) -> Account | None:
    """Возвращает активный аккаунт читателя или гостя."""
    account = await db.get(Account, account_id) if account_id is not None else None
    return account if account and account.is_active else None


async def require_user(
    account_id: int = Depends(require_account_id),
    db: AsyncSession = Depends(get_db),
) -> Account:
    """Проверяет сессию и активность автора перед изменениями."""
    account = await db.get(Account, account_id)
    if account is None or not account.is_active:
        raise HTTPException(401, "Необходима авторизация")
    return account


def get_visitor(
    request: Request,
    response: Response,
    account: Account | None = Depends(get_current_user),
) -> str:
    """Отличает читателей для одного просмотра за сутки."""
    if account:
        return f"user:{account.id}"
    token = request.cookies.get("post_visitor")
    if not token or len(token) > 32:
        token = secrets.token_urlsafe(16)
        response.set_cookie(
            "post_visitor",
            token,
            max_age=31536000,
            httponly=True,
            secure=request.url.scheme == "https",
            samesite="lax",
        )
    return f"guest:{token}"
