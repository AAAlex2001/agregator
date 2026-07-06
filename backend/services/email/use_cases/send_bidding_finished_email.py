"Use case: send bidding finished email."
from models.order import Order
from models.response import OrderResponse
from models.user import User
from schemas.email import BiddingFinishedContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import format_price, full_name, greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "bidding_finished"
CTA_URL = "https://plus-resurs.com/expert/orders"
PREFERENCE_FIELD = "email_on_bidding_finished"

OUTCOME_WON = "won"
OUTCOME_LOST = "lost"

LOST_SUBJECT = "Заказчик выбрал другого исполнителя — Ресурс-Плюс"


def won_subject(order: Order) -> str:
    "Публичный метод сервисного слоя."
    return f"Уведомление о победе №{order.id} «{order.title or 'Заказ'}»"


class SendBiddingFinishedEmailUseCase:
    """
    Эксперту уходит уведомление, когда закрываются торги по его отклику:
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

        response = None
        if outcome == OUTCOME_WON and response_id is not None:
            response = await self.repo.find_response(response_id)

        customer = None
        if response is not None and response.order is not None:
            customer = response.order.customer

        subject = won_subject(order) if outcome == OUTCOME_WON else LOST_SUBJECT
        context = self.build_context(expert, order, outcome, response, customer)
        self.dispatcher.notify(expert, PREFERENCE_FIELD, TEMPLATE, subject, context)

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
