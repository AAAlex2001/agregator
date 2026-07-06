"Use case: send bidding finished email."
from models.order import Order
from models.response import OrderResponse
from models.user import User
from schemas.email import BiddingFinishedContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import escape_html, format_price, greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "bidding_finished"
CTA_URL = "https://plus-resurs.com/expert/orders"
PREFERENCE_FIELD = "email_on_bidding_finished"

OUTCOME_WON = "won"
OUTCOME_LOST = "lost"


def full_name(user: User) -> str:
    "Публичный метод сервисного слоя."
    parts = [user.first_name or "", user.last_name or ""]
    return " ".join(p for p in parts if p).strip()


def won_subject(order: Order) -> str:
    "Публичный метод сервисного слоя."
    return f"Уведомление о победе №{order.id} «{order.title or 'Заказ'}»"


LOST_SUBJECT = "Заказчик выбрал другого исполнителя — Ресурс-Плюс"


class SendBiddingFinishedEmailUseCase:
    """
    Эксперту уходит письмо, когда закрываются торги по его отклику:
    либо он выбран исполнителем, либо заказчик выбрал другого.
    """

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(
        self,
        expert_id: int,
        order_id: int,
        outcome: str,
        response_id: int | None = None,
    ) -> None:
        "Запускает основной сценарий use case."
        if outcome not in {OUTCOME_WON, OUTCOME_LOST}:
            return

        expert = await self.repo.find_user(expert_id)
        if expert is None:
            return

        order = await self.repo.find_order(order_id)
        if order is None:
            return

        order_title = escape_html(order.title or f"Заказ #{order.id}")
        response = None
        if outcome == OUTCOME_WON and response_id is not None:
            response = await self.repo.find_response(response_id)
        if outcome == OUTCOME_WON:
            price_line = (
                f"\nВаша цена: {format_price(response.proposed_sum_amount)}"
                if response is not None else ""
            )
            tg_text = (
                f"🎉 <b>Вы победили в торгах!</b>\n"
                f"Заявка: «{order_title}»\n"
                f"Заказчик выбрал вас исполнителем.{price_line}\n\n"
                f"Откройте приложение, чтобы перейти к работе."
            )
        else:
            tg_text = (
                f"🔚 <b>Торги завершены</b>\n"
                f"Заявка: «{order_title}»\n"
                f"Заказчик выбрал другого исполнителя. Спасибо за участие!\n\n"
                f"Откройте приложение, чтобы посмотреть новые заявки."
            )
        self.dispatcher.send_telegram(expert, None, tg_text)

        if not self.dispatcher.can_send(expert, PREFERENCE_FIELD):
            return

        customer = None
        if response is not None and response.order is not None:
            customer = response.order.customer

        subject = won_subject(order) if outcome == OUTCOME_WON else LOST_SUBJECT
        context = self.build_context(expert, order, outcome, response, customer)
        self.dispatcher.dispatch(expert.email, TEMPLATE, subject, context)

    def build_context(
        self,
        expert: User,
        order: Order,
        outcome: str,
        response: OrderResponse | None,
        customer: User | None,
    ) -> BiddingFinishedContext:
        "Строит объект из входных данных."
        winning_price = (
            format_price(response.proposed_sum_amount) if response is not None else ""
        )
        customer_inn = customer.inn or "" if customer is not None else ""
        customer_email = customer.email or "" if customer is not None else ""
        customer_phone = customer.phone or "" if customer is not None else ""
        customer_contact_name = full_name(customer) if customer is not None else ""

        return BiddingFinishedContext(
            expert_greeting=greeting_for(expert),
            order_title=order.title or f"Заказ #{order.id}",
            outcome=outcome,
            cta_url=CTA_URL,
            badges=[badge.text for badge in order.badges],
            order_number=str(order.id),
            customer_name=order.company or "",
            winning_price=winning_price,
            customer_inn=customer_inn,
            customer_email=customer_email,
            customer_phone=customer_phone,
            customer_contact_name=customer_contact_name,
        )
