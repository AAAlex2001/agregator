from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from services.payment import PaymentWebhookService

router = APIRouter(prefix="/payments", tags=["payments"])


class WebhookAck(BaseModel):
    "Ответ-подтверждение YooKassa-вебхука."

    status: str


@router.post("/webhook", response_model=WebhookAck)
async def payment_webhook(
    request: Request, db: AsyncSession = Depends(get_db)
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

    service = PaymentWebhookService(db)
    await service.handle_webhook(event_type, yookassa_id)
    return WebhookAck(status="ok")
