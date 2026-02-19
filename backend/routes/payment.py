from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.payment import (
    BalanceResponse,
    CreatePaymentRequest,
    CreatePaymentResponse,
    PaymentItem,
    PaymentListResponse,
    RefundRequest,
    WithdrawRequest,
)
from services.payment import PaymentService

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/create", response_model=CreatePaymentResponse)
async def create_payment(
    data: CreatePaymentRequest,
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    """Создание платежа на пополнение баланса."""
    if data.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Сумма должна быть больше 0",
        )

    service = PaymentService(db)
    try:
        payment, confirmation_url = await service.create_deposit(
            x_user_id,
            data.amount,
            data.return_url,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return CreatePaymentResponse(
        payment_id=payment.id,
        confirmation_url=confirmation_url,
    )


@router.post("/webhook")
async def payment_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Обработка вебхуков от YooKassa."""
    body = await request.json()

    event_type = body.get("event")
    payment_object = body.get("object", {})
    yookassa_id = payment_object.get("id")

    if not event_type or not yookassa_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Невалидный вебхук",
        )

    service = PaymentService(db)
    await service.handle_webhook(event_type, yookassa_id)
    return {"status": "ok"}


@router.get("/balance", response_model=BalanceResponse)
async def get_balance(
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    """Получение баланса пользователя."""
    service = PaymentService(db)
    try:
        balance = await service.get_balance(x_user_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    return BalanceResponse(balance=balance)


@router.get("/history", response_model=PaymentListResponse)
async def get_payment_history(
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    """История платежей пользователя."""
    service = PaymentService(db)
    payments = await service.list_payments(x_user_id)

    items = [
        PaymentItem(
            id=p.id,
            yookassa_id=p.yookassa_id,
            amount=p.amount,
            payment_type=p.payment_type.value,
            status=p.status.value,
            description=p.description,
            created_at=p.created_at,
        )
        for p in payments
    ]
    return PaymentListResponse(items=items)


@router.post("/refund")
async def refund_payment(
    data: RefundRequest,
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    """Возврат платежа."""
    service = PaymentService(db)
    try:
        payment = await service.create_refund(data.payment_id, x_user_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    return {"detail": "Возврат выполнен", "payment_id": payment.id}


@router.post("/withdraw")
async def withdraw(
    data: WithdrawRequest,
    db: AsyncSession = Depends(get_db),
    x_user_id: int = Header(..., alias="X-User-Id"),
):
    """Вывод средств с баланса."""
    if data.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Сумма должна быть больше 0",
        )

    card = data.card_number.replace(" ", "")
    if not card.isdigit() or len(card) < 13 or len(card) > 19:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Некорректный номер карты",
        )

    service = PaymentService(db)
    try:
        payment = await service.create_withdrawal(x_user_id, data.amount, card)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return {
        "detail": "Заявка на вывод создана",
        "payment_id": payment.id,
        "new_balance": (await service.get_balance(x_user_id)),
    }
