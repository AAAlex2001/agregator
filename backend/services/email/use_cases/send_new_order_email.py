from models.order import Order
from models.user import User
from schemas.email import NewOrderContext, OrderBrief
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "new_order"
SUBJECT = "Новая заявка на Ресурс-Плюс"
CTA_URL = "https://plus-resurs.com/expert/orders"


def badge_type(text: str) -> str:
    "Тип экспертизы из текста badge: 'Э4 КЛ' → 'КЛ', 'Э1 КЛ/ТП' → 'КЛ/ТП'."
    parts = text.split(" ", 1)
    return parts[1] if len(parts) == 2 else text


class SendNewOrderEmailUseCase:
    "Письмо о новой заявке только экспертам, чей фильтр типов пересекается с типами заказа."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher):
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, order_id: int) -> None:
        order = await self.repo.find_order(order_id)
        if order is None:
            return

        order_types = {badge_type(badge.text) for badge in order.badges}
        if not order_types:
            return

        experts = await self.repo.list_experts_subscribed_to_order_types()
        for expert in experts:
            wanted = set(expert.notify_order_types or [])
            if not wanted & order_types:
                continue
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
                badges=[badge.text for badge in order.badges],
            ),
        )
