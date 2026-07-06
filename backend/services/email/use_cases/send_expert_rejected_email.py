"Use case: send expert rejected email."
from models.response import OrderResponse
from models.user import User
from schemas.email import ExpertRejectedContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import escape_html, full_name, greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "expert_rejected"
SUBJECT = "Эксперт отказался от вашей заявки — Ресурс-Плюс"
CTA_URL = "https://plus-resurs.com/customer/orders"
PREFERENCE_FIELD = "email_on_expert_rejected"


class SendExpertRejectedEmailUseCase:
    "Заказчик получает письмо, когда ранее выбранный эксперт отказался от выполнения."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, response_id: int) -> None:
        "Запускает основной сценарий use case."
        response = await self.repo.find_response(response_id)
        if response is None or response.order is None:
            return

        customer = response.order.customer
        order_title = escape_html(response.order.title or f"Заказ #{response.order_id}")
        expert_name = escape_html(full_name(response.expert) or "Эксперт")
        self.dispatcher.send_telegram(
            customer,
            None,
            f"⚠️ <b>Эксперт отказался от заявки</b>\n"
            f"Заявка: «{order_title}»\n"
            f"Исполнитель: {expert_name}\n\n"
            f"Откройте приложение, чтобы выбрать другого эксперта.",
        )
        if not self.dispatcher.can_send(customer, PREFERENCE_FIELD):
            return

        context = self.build_context(response, customer)
        self.dispatcher.dispatch(customer.email, TEMPLATE, SUBJECT, context)

    def build_context(self, response: OrderResponse, customer: User) -> ExpertRejectedContext:
        "Строит объект из входных данных."
        order = response.order
        order_title = (order.title if order else None) or f"Заказ #{response.order_id}"
        expert_name = full_name(response.expert) or "Эксперт"
        return ExpertRejectedContext(
            customer_greeting=greeting_for(customer),
            order_title=order_title,
            cta_url=CTA_URL,
            expert_name=expert_name,
        )
