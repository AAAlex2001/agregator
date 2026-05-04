from schemas.email import QuestionAskedContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import full_name, greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "question_asked"
SUBJECT = "Новый вопрос по заказу — Ресурс-Плюс"
CTA_URL_TEMPLATE = "https://plus-resurs.com/customer/orders"
PREFERENCE_FIELD = "email_on_question_asked"


class SendQuestionAskedEmailUseCase:
    "Письмо заказчику: эксперт задал публичный вопрос по его заказу."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher):
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, question_id: int) -> None:
        question = await self.repo.find_question(question_id)
        if question is None or question.order is None:
            return

        recipient = question.order.customer
        if not self.dispatcher.can_send(recipient, PREFERENCE_FIELD):
            return

        context = QuestionAskedContext(
            customer_greeting=greeting_for(recipient),
            expert_name=full_name(question.expert) or "Эксперт",
            order_title=question.order.title or "Заявка",
            question_text=question.question or "",
            cta_url=CTA_URL_TEMPLATE,
        )
        self.dispatcher.dispatch(recipient.email, TEMPLATE, SUBJECT, context)
