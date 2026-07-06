"Use case: send order updated email."
from models.order import Order
from models.user import User
from schemas.email import OrderBrief, OrderUpdatedContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "order_updated"
SUBJECT = "Заявка, на которую вы откликнулись, изменилась — Ресурс-Плюс"
CTA_URL = "https://plus-resurs.com/expert/orders"
PREFERENCE_FIELD = "email_on_order_updated"
TG_CTA = "Чтобы перейти к заявке, откройте «Мои отклики» в приложении."


class SendOrderUpdatedEmailUseCase:
    "Эксперты, уже откликнувшиеся на заявку, получают уведомление об изменениях."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, order_id: int, changes_summary: str) -> None:
        "Запускает основной сценарий use case."
        if not changes_summary:
            return

        order = await self.repo.find_order(order_id)
        if order is None:
            return

        experts = await self.repo.list_responders(order_id)
        for expert in experts:
            context = self.build_context(order, expert, changes_summary)
            self.dispatcher.notify(expert, PREFERENCE_FIELD, TEMPLATE, SUBJECT, context, TG_CTA)

    def build_context(
        self,
        order: Order,
        expert: User,
        changes_summary: str,
    ) -> OrderUpdatedContext:
        "Строит объект из входных данных."
        return OrderUpdatedContext(
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
            changes_summary=changes_summary,
        )
