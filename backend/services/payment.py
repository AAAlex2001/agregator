import os
import uuid

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from yookassa import Configuration, Payment as YooPayment, Refund as YooRefund

from models.payment import Payment, PaymentStatus, PaymentType
from models.user import User

load_dotenv()

Configuration.account_id = os.getenv("YOOKASSA_SHOP_ID", "")
Configuration.secret_key = os.getenv("YOOKASSA_SECRET_KEY", "")


class PaymentService:
    """Сервис для работы с платежами YooKassa."""

    def __init__(self, db: AsyncSession):
        self.db = db

    def kopecks_to_rub(self, kopecks: int) -> str:
        """Конвертация копеек в строку рублей для YooKassa API."""
        return f"{kopecks / 100:.2f}"

    async def get_user(self, user_id: int) -> User:
        """Получение пользователя по ID."""
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise ValueError("Пользователь не найден")
        return user

    async def create_deposit(
        self,
        user_id: int,
        amount: int,
        return_url: str,
    ) -> tuple[Payment, str]:
        """Создание платежа на пополнение баланса. Возвращает (Payment, confirmation_url)."""
        user = await self.get_user(user_id)
        resolved_return_url = return_url.strip()
        if not resolved_return_url:
            raise ValueError("Не задан URL возврата после оплаты")

        payment = Payment(
            user_id=user.id,
            amount=amount,
            payment_type=PaymentType.DEPOSIT,
            status=PaymentStatus.PENDING,
            description=f"Пополнение баланса на {self.kopecks_to_rub(amount)} ₽",
        )
        self.db.add(payment)
        await self.db.flush()

        idempotence_key = str(uuid.uuid4())
        yoo_payment = YooPayment.create(
            {
                "amount": {
                    "value": self.kopecks_to_rub(amount),
                    "currency": "RUB",
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": resolved_return_url,
                },
                "capture": True,
                "description": payment.description,
                "metadata": {
                    "payment_id": payment.id,
                    "user_id": user.id,
                },
            },
            idempotence_key,
        )

        payment.yookassa_id = yoo_payment.id
        await self.db.flush()

        confirmation_url = yoo_payment.confirmation.confirmation_url
        return payment, confirmation_url

    async def handle_webhook(self, event_type: str, yookassa_id: str) -> None:
        """Обработка вебхука от YooKassa."""
        result = await self.db.execute(
            select(Payment).where(Payment.yookassa_id == yookassa_id)
        )
        payment = result.scalars().first()
        if not payment:
            return

        if event_type == "payment.succeeded":
            await self.handle_succeeded(payment)
        elif event_type == "payment.waiting_for_capture":
            await self.handle_waiting_for_capture(payment)
        elif event_type == "payment.canceled":
            await self.handle_canceled(payment)
        elif event_type == "refund.succeeded":
            await self.handle_refund_succeeded(payment)

    async def handle_succeeded(self, payment: Payment) -> None:
        """Платёж успешен — зачисляем на баланс."""
        if payment.status == PaymentStatus.SUCCEEDED:
            return

        payment.status = PaymentStatus.SUCCEEDED
        user = await self.get_user(payment.user_id)

        if payment.payment_type == PaymentType.DEPOSIT:
            user.balance = user.balance + payment.amount

        await self.db.flush()

    async def handle_waiting_for_capture(self, payment: Payment) -> None:
        """Платёж ожидает подтверждения."""
        payment.status = PaymentStatus.WAITING_FOR_CAPTURE
        await self.db.flush()

    async def handle_canceled(self, payment: Payment) -> None:
        """Платёж отменён."""
        payment.status = PaymentStatus.CANCELED
        await self.db.flush()

    async def handle_refund_succeeded(self, payment: Payment) -> None:
        """Возврат успешен — списываем с баланса."""
        if payment.status == PaymentStatus.REFUNDED:
            return

        payment.status = PaymentStatus.REFUNDED
        user = await self.get_user(payment.user_id)
        user.balance = max(0, user.balance - payment.amount)
        await self.db.flush()

    async def create_refund(self, payment_id: int, user_id: int) -> Payment:
        """Создание возврата через YooKassa."""
        result = await self.db.execute(
            select(Payment).where(
                Payment.id == payment_id,
                Payment.user_id == user_id,
                Payment.status == PaymentStatus.SUCCEEDED,
            )
        )
        payment = result.scalars().first()
        if not payment:
            raise ValueError("Платёж не найден или недоступен для возврата")

        idempotence_key = str(uuid.uuid4())
        YooRefund.create(
            {
                "payment_id": payment.yookassa_id,
                "amount": {
                    "value": self.kopecks_to_rub(payment.amount),
                    "currency": "RUB",
                },
            },
            idempotence_key,
        )

        payment.status = PaymentStatus.REFUNDED
        user = await self.get_user(payment.user_id)
        user.balance = max(0, user.balance - payment.amount)
        await self.db.flush()
        return payment

    async def create_withdrawal(self, user_id: int, amount: int, card_number: str) -> Payment:
        """Создание заявки на вывод средств."""
        user = await self.get_user(user_id)

        if amount <= 0:
            raise ValueError("Сумма должна быть больше 0")
        if user.balance < amount:
            raise ValueError("Недостаточно средств на балансе")

        card_masked = card_number[-4:].rjust(len(card_number), "*")

        payment = Payment(
            user_id=user.id,
            amount=amount,
            payment_type=PaymentType.WITHDRAWAL,
            status=PaymentStatus.PENDING,
            description=f"Вывод {self.kopecks_to_rub(amount)} ₽ на карту {card_masked}",
        )
        self.db.add(payment)

        user.balance = user.balance - amount

        await self.db.flush()
        return payment

    async def get_balance(self, user_id: int) -> int:
        """Получение баланса пользователя в копейках."""
        user = await self.get_user(user_id)
        return user.balance

    async def list_payments(self, user_id: int) -> list[Payment]:
        """Список платежей пользователя."""
        result = await self.db.execute(
            select(Payment)
            .where(Payment.user_id == user_id)
            .order_by(Payment.created_at.desc())
        )
        return list(result.scalars().all())
