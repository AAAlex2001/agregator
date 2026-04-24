from models.order import Order
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

SUBJECTS = {
    OUTCOME_WON: "Вас выбрали исполнителем — Ресурс-Плюс",
    OUTCOME_LOST: "Заказчик выбрал другого исполнителя — Ресурс-Плюс",
}


class SendBiddingFinishedEmailUseCase:
    """
    Эксперту уходит письмо, когда закрываются торги по его отклику:
    либо он выбран исполнителем, либо заказчик выбрал другого.
    """

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher):
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, expert_id: int, order_id: int, outcome: str) -> None:
        if outcome not in SUBJECTS:
            return

        expert = await self.repo.find_user(expert_id)
        if expert is None:
            return
        if not self.dispatcher.can_send(expert, PREFERENCE_FIELD):
            return

        order = await self.repo.find_order(order_id)
        if order is None:
            return

        context = self.build_context(expert, order, outcome)
        self.dispatcher.dispatch(expert.email, TEMPLATE, SUBJECTS[outcome], context)

    def build_context(
        self, expert: User, order: Order, outcome: str
    ) -> BiddingFinishedContext:
        return BiddingFinishedContext(
            expert_greeting=greeting_for(expert),
            order_title=order.title or f"Заказ #{order.id}",
            outcome=outcome,
            cta_url=CTA_URL,
        )
