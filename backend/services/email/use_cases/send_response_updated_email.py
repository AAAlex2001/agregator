"Use case: send response updated email."
from models.response import OrderResponse
from models.user import User
from schemas.email import ExpertBrief, ResponseBrief, ResponseUpdatedContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import (
    contact_line,
    escape_html,
    format_date,
    format_price,
    full_name,
    greeting_for,
    preview,
)
from services.email.repository import EmailRepository

TEMPLATE = "response_updated"
SUBJECT = "Эксперт обновил отклик на вашу заявку — Ресурс-Плюс"
CTA_URL = "https://plus-resurs.com/customer/orders"
PREFERENCE_FIELD = "email_on_response_updated"


class SendResponseUpdatedEmailUseCase:
    "Заказчик получает письмо, когда эксперт меняет стоимость/срок/комментарий/файлы отклика."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, response_id: int, changes_summary: str) -> None:
        "Запускает основной сценарий use case."
        if not changes_summary:
            return

        response = await self.repo.find_response(response_id)
        if response is None or response.order is None:
            return

        customer = response.order.customer
        order_title = escape_html(response.order.title or f"Заказ #{response.order_id}")
        expert_name = escape_html(full_name(response.expert) or "Эксперт")
        summary_line = f"\nЧто изменилось: {preview(changes_summary, 200)}" if changes_summary else ""
        self.dispatcher.send_telegram(
            customer,
            None,
            f"🔄 <b>Эксперт обновил отклик</b>\n"
            f"Заявка: «{order_title}»\n"
            f"Эксперт: {expert_name}{summary_line}\n"
            f"Актуальная цена: {format_price(response.proposed_sum_amount)}\n"
            f"Срок: до {format_date(response.proposed_deadline)}\n\n"
            f"Откройте приложение, чтобы пересмотреть отклик.",
        )
        if not self.dispatcher.can_send(customer, PREFERENCE_FIELD):
            return

        context = self.build_context(response, customer, changes_summary)
        self.dispatcher.dispatch(customer.email, TEMPLATE, SUBJECT, context)

    def build_context(
        self,
        response: OrderResponse,
        customer: User,
        changes_summary: str,
    ) -> ResponseUpdatedContext:
        "Строит объект из входных данных."
        order = response.order
        expert = response.expert
        order_title = (order.title if order else None) or f"Заказ #{response.order_id}"

        return ResponseUpdatedContext(
            customer_greeting=greeting_for(customer),
            order_title=order_title,
            cta_url=CTA_URL,
            expert=ExpertBrief(
                name=full_name(expert) or "Эксперт",
                contact=contact_line(expert),
            ),
            response=ResponseBrief(
                proposed_sum_amount=response.proposed_sum_amount,
                proposed_deadline=response.proposed_deadline,
                comment=response.comment or "",
                files_count=len(response.technical_files or []),
            ),
            changes_summary=changes_summary,
        )
