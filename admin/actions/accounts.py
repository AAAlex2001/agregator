"POST-роут выдачи подписки аккаунту через админку (создаёт новую активную, гасит старые)."

from datetime import UTC, datetime

from fastapi import FastAPI, Form, HTTPException
from starlette.requests import Request
from starlette.responses import RedirectResponse

from db import SessionLocal
from helpers.subscription import (
    compute_subscription_expires_at,
    compute_subscription_responses_remaining,
)
from models import Account, PricingPlan, SubscriptionStatus, UserSubscription


def setup(app: FastAPI) -> None:
    "Регистрирует роуты раздела учётных записей в переданном приложении FastAPI."

    @app.post("/admin-actions/accounts/{account_id}/grant-subscription", name="grant_account_subscription")
    async def grant_account_subscription(
        request: Request,
        account_id: int,
        plan_id: int = Form(...),
    ) -> RedirectResponse:
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)

        with SessionLocal() as db:
            account = db.get(Account, account_id)
            if account is None:
                raise HTTPException(status_code=404, detail="Аккаунт не найден")

            plan = db.get(PricingPlan, plan_id)
            if plan is None or not plan.is_active:
                raise HTTPException(status_code=404, detail="Активный тариф не найден")

            now = datetime.now(UTC)
            (
                db.query(UserSubscription)
                .filter(
                    UserSubscription.user_id == account_id,
                    UserSubscription.status.in_(
                        [SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING]
                    ),
                )
                .update(
                    {
                        UserSubscription.status: SubscriptionStatus.EXPIRED,
                        UserSubscription.updated_at: now,
                    },
                    synchronize_session=False,
                )
            )
            db.add(
                UserSubscription(
                    user_id=account_id,
                    plan_id=plan.id,
                    kind=plan.kind,
                    status=SubscriptionStatus.ACTIVE,
                    activated_at=now,
                    expires_at=compute_subscription_expires_at(plan, now),
                    responses_remaining=compute_subscription_responses_remaining(plan.kind),
                    payment_id=None,
                )
            )
            db.commit()

        return RedirectResponse(
            request.headers.get("referer") or f"/admin/account/details/{account_id}",
            status_code=303,
        )
