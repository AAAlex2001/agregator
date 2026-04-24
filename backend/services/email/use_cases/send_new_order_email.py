from models.order import Order
from models.user import User
from schemas.email import NewOrderContext, OrderBrief
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "new_order"
SUBJECT = "Новая заявка на Ресурс-Плюс"
CTA_URL = "https://plus-resurs.com/expert/orders"
PREFERENCE_FIELD = "email_on_new_order"


class SendNewOrderEmailUseCase:
    "Каждому эксперту с включённым флагом шлём письмо о новой заявке."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher):
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, order_id: int) -> None:
        order = await self.repo.find_order(order_id)
        if order is None:
            return

        experts = await self.repo.list_experts_with_preference(PREFERENCE_FIELD)
        if not experts:
            return

        for expert in experts:
            context = self.build_context(order, expert)
            self.dispatcher.dispatch(expert.email, TEMPLATE, SUBJECT, context)

    def build_context(self, order: Order, expert: User) -> NewOrderContext:
        return NewOrderContext(
            expert_greeting=greeting_for(expert),
            order_title=order.title or f"Заказ #{order.id}",
            cta_url=CTA_URL,
            order=OrderBrief(
                company=order.company or "",
                sum_amount=order.sum_amount,
                deadline=order.deadline,
                comment=order.comment or "",
            ),
        )
