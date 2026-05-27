from models.order import Order
from models.response import OrderResponse
from models.user import User
from schemas.email import BiddingFinishedContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "bidding_finished"
CTA_URL = "https://plus-resurs.com/expert/orders"
PREFERENCE_FIELD = "email_on_bidding_finished"

OUTCOME_WON = "won"
OUTCOME_LOST = "lost"


def format_price(amount_kopecks: int) -> str:
    if amount_kopecks <= 0:
        return "не определена"
    roubles = amount_kopecks // 100
    formatted = f"{roubles:,}".replace(",", " ")
    if amount_kopecks % 100:
        kopecks = amount_kopecks % 100
        return f"{formatted},{kopecks:02d} ₽"
    return f"{formatted} ₽"


def full_name(user: User) -> str:
    parts = [user.first_name or "", user.last_name or ""]
    return " ".join(p for p in parts if p).strip()


def won_subject(order: Order) -> str:
    return f"Уведомление о победе №{order.id} «{order.title or 'Заказ'}»"


LOST_SUBJECT = "Заказчик выбрал другого исполнителя — Ресурс-Плюс"


class SendBiddingFinishedEmailUseCase:
    """
    Эксперту уходит письмо, когда закрываются торги по его отклику:
    либо он выбран исполнителем, либо заказчик выбрал другого.
    """

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher):
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(
        self,
        expert_id: int,
        order_id: int,
        outcome: str,
        response_id: int | None = None,
    ) -> None:
        if outcome not in {OUTCOME_WON, OUTCOME_LOST}:
            return

        expert = await self.repo.find_user(expert_id)
        if expert is None:
            return
        if not self.dispatcher.can_send(expert, PREFERENCE_FIELD):
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
        self.dispatcher.dispatch(expert.email, TEMPLATE, subject, context)

    def build_context(
        self,
        expert: User,
        order: Order,
        outcome: str,
        response: OrderResponse | None,
        customer: User | None,
    ) -> BiddingFinishedContext:
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
