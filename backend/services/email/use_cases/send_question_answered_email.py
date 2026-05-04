from schemas.email import QuestionAnsweredContext
from services.email.dispatcher import EmailDispatcher
from services.email.formatting import greeting_for
from services.email.repository import EmailRepository

TEMPLATE = "question_answered"
SUBJECT = "Заказчик ответил на ваш вопрос — Ресурс-Плюс"
CTA_URL_TEMPLATE = "https://plus-resurs.com/expert/orders"
PREFERENCE_FIELD = "email_on_question_answered"


class SendQuestionAnsweredEmailUseCase:
    "Письмо эксперту-автору вопроса: заказчик ответил."

    def __init__(self, repo: EmailRepository, dispatcher: EmailDispatcher):
        self.repo = repo
        self.dispatcher = dispatcher

    async def execute(self, question_id: int) -> None:
        question = await self.repo.find_question(question_id)
        if question is None or question.order is None or question.answer is None:
            return

        recipient = question.expert
        if not self.dispatcher.can_send(recipient, PREFERENCE_FIELD):
            return

        context = QuestionAnsweredContext(
            expert_greeting=greeting_for(recipient),
            order_title=question.order.title or "Заявка",
            question_text=question.question or "",
            answer_text=question.answer or "",
            cta_url=CTA_URL_TEMPLATE,
        )
        self.dispatcher.dispatch(recipient.email, TEMPLATE, SUBJECT, context)
