"Use case: письмо подписчикам вопроса о публикации официального ответа."

from config import email_config
from schemas.email import RtnAnswerPublishedContext
from services.email.dispatcher import EmailDispatcher

TEMPLATE = "rtn_question_answered"
SUBJECT = "Ответ Ростехнадзора опубликован — Ресурс-Плюс"
CTA_URL_TEMPLATE = "{base}/rtn/{slug}"


class SendRtnAnswerPublishedEmailUseCase:
    def __init__(self, dispatcher: EmailDispatcher) -> None:
        self.dispatcher = dispatcher

    def execute(self, recipients: list[str], question_text: str, answer_title: str, answer_slug: str) -> None:
        if not recipients:
            return
        context = RtnAnswerPublishedContext(
            question_text=question_text,
            answer_title=answer_title,
            cta_url=CTA_URL_TEMPLATE.format(base=email_config.public_base_url, slug=answer_slug),
        )
        for recipient in recipients:
            self.dispatcher.dispatch(recipient, TEMPLATE, SUBJECT, context)
