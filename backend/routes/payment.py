from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.payments.dependencies import get_apply_webhook_payment_usecase
from app.blitz.payments.services.usecases.apply_webhook_payment import ApplyWebhookPaymentUseCase
from database.database import get_db
from services.payment import PaymentWebhookService

router = APIRouter(prefix="/payments", tags=["payments"])


class WebhookAck(BaseModel):
    "Ответ-подтверждение YooKassa-вебхука."

    status: str


@router.post("/webhook", response_model=WebhookAck)
async def payment_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    blitz_payments: ApplyWebhookPaymentUseCase = Depends(get_apply_webhook_payment_usecase),
) -> WebhookAck:
    "Вебхук YooKassa: обновляет статус платежа. Активация подписки идёт через SubscriptionAccess."
    body = await request.json()

    event_type = body.get("event")
    payment_object = body.get("object", {})
    yookassa_id = payment_object.get("id")

    if not event_type or not yookassa_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Невалидный вебхук",
        )

    service = PaymentWebhookService(db, blitz_payments.execute)
    await service.handle_webhook(yookassa_id)
    return WebhookAck(status="ok")
