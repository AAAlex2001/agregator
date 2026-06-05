"POST-роут выдачи подписки пользователю через админку (создаёт новую активную, гасит старые)."

from datetime import UTC, datetime

from fastapi import FastAPI, Form, HTTPException
from starlette.requests import Request
from starlette.responses import RedirectResponse

from db import SessionLocal
from helpers.subscription import (
    compute_subscription_expires_at,
    compute_subscription_responses_remaining,
)
from models import PricingPlan, SubscriptionStatus, User, UserSubscription


def setup(app: FastAPI) -> None:
    "Регистрирует роуты раздела пользователей в переданном приложении FastAPI."

    @app.post("/admin-actions/users/{user_id}/grant-subscription", name="grant_user_subscription")
    async def grant_user_subscription(
        request: Request,
        user_id: int,
        plan_id: int = Form(...),
    ) -> RedirectResponse:
        if not request.session.get("authenticated", False):
            return RedirectResponse("/admin/login", status_code=303)

        with SessionLocal() as db:
            user = db.get(User, user_id)
            if user is None:
                raise HTTPException(status_code=404, detail="Пользователь не найден")

            plan = db.get(PricingPlan, plan_id)
            if plan is None or not plan.is_active:
                raise HTTPException(status_code=404, detail="Активный тариф не найден")

            now = datetime.now(UTC)
            (
                db.query(UserSubscription)
                .filter(
                    UserSubscription.user_id == user_id,
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
                    user_id=user_id,
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
            request.headers.get("referer") or f"/admin/user/details/{user_id}",
            status_code=303,
        )
