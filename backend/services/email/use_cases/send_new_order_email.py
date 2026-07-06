"Use case: send new order email."
from models.order import Order
from models.user import User
from schemas.email import NewOrderContext, OrderBrief
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import escape_html, format_date, format_price, greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "new_order"
SUBJECT = "Новая заявка на Ресурс-Плюс"
CTA_URL = "https://plus-resurs.com/expert/orders"


class SendNewOrderEmailUseCase:
    "Письмо о новой заявке только экспертам, чей фильтр кодов пересекается с бейджами заказа."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, order_id: int) -> None:
        "Запускает основной сценарий use case."
        order = await self.repo.find_order(order_id)
        if order is None:
            return

        order_codes = {badge.text for badge in order.badges}
        if not order_codes:
            return

        order_title = escape_html(order.title or f"Заказ #{order.id}")
        company_line = f"\nЗаказчик: {escape_html(order.company)}" if order.company else ""
        experts = await self.repo.list_experts_subscribed_to_order_types()
        for expert in experts:
            wanted = set(expert.notify_order_types or [])
            if not wanted & order_codes:
                continue
            context = self.build_context(order, expert)
            self.dispatcher.dispatch(expert.email, TEMPLATE, SUBJECT, context)
            self.dispatcher.send_telegram(
                expert,
                None,
                f"🆕 <b>Новая заявка по вашим направлениям</b>\n"
                f"«{order_title}»{company_line}\n"
                f"Бюджет: {format_price(order.sum_amount)}\n"
                f"Срок: до {format_date(order.deadline)}\n\n"
                f"Откройте приложение, чтобы откликнуться.",
            )

    def build_context(self, order: Order, expert: User) -> NewOrderContext:
        "Строит объект из входных данных."
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
