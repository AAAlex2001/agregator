"Use case: send response created email."
from models.response import OrderResponse
from models.user import User
from schemas.email import (
    ExpertBrief,
    OrderBrief,
    ResponseBrief,
    ResponseCreatedContext,
)
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import contact_line, full_name, greeting_for
from services.email.repository import EmailRepository, ExpertStats

TEMPLATE = "response_notification"
SUBJECT = "Новый отклик на вашу заявку — Ресурс-Плюс"
CTA_URL = "https://plus-resurs.com/customer/orders"
PREFERENCE_FIELD = "email_on_response_created"


class SendResponseCreatedEmailUseCase:
    "Заказчик получает письмо, когда эксперт создал отклик на его заявку."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, response_id: int) -> None:
        "Запускает основной сценарий use case."
        response = await self.repo.find_response(response_id)
        if response is None or response.order is None:
            return

        customer = response.order.customer
        stats = await self.repo.get_expert_stats(response.expert_id)
        context = self.build_context(response, customer, stats)
        self.dispatcher.notify(customer, PREFERENCE_FIELD, TEMPLATE, SUBJECT, context)

    def build_context(
        self,
        response: OrderResponse,
        customer: User,
        stats: ExpertStats,
    ) -> ResponseCreatedContext:
        "Строит объект из входных данных."
        order = response.order
        expert = response.expert
        order_title = (order.title if order else None) or f"Заказ #{response.order_id}"

        return ResponseCreatedContext(
            customer_greeting=greeting_for(customer),
            order_title=order_title,
            cta_url=CTA_URL,
            order=OrderBrief(
                company=(order.company if order else "") or "",
                sum_amount=order.sum_amount if order else None,
                deadline=order.deadline if order else None,
                comment=(order.comment if order else "") or "",
                badges=[badge.text for badge in order.badges] if order else [],
            ),
            expert=ExpertBrief(
                name=full_name(expert) or "Эксперт",
                contact=contact_line(expert),
                review_count=stats.review_count,
                avg_rating=stats.avg_rating,
            ),
            response=ResponseBrief(
                proposed_sum_amount=response.proposed_sum_amount,
                proposed_deadline=response.proposed_deadline,
                comment=response.comment or "",
                files_count=len(response.technical_files or []),
            ),
        )
