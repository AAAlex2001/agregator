"Use case: send question asked email."
from schemas.email import QuestionAskedContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import escape_html, full_name, greeting_for, preview
from services.email.repository import EmailRepository

TEMPLATE = "question_asked"
SUBJECT = "Новый вопрос по заказу — Ресурс-Плюс"
CTA_URL_TEMPLATE = "https://plus-resurs.com/customer/orders"
PREFERENCE_FIELD = "email_on_question_asked"


class SendQuestionAskedEmailUseCase:
    "Письмо заказчику: эксперт задал публичный вопрос по его заказу."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher) -> None:
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, question_id: int) -> None:
        "Запускает основной сценарий use case."
        question = await self.repo.find_question(question_id)
        if question is None or question.order is None:
            return

        recipient = question.order.customer
        order_title = escape_html(question.order.title or "Заявка")
        question_line = preview(question.question, 200)
        self.dispatcher.send_telegram(
            recipient,
            None,
            f"❓ <b>Новый вопрос по вашей заявке</b>\n"
            f"Заявка: «{order_title}»\n"
            f"Вопрос: «{question_line}»\n\n"
            f"Откройте приложение, чтобы ответить.",
        )
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
