"Use case: письмо модераторам о новом вопросе в рубрику «Ростехнадзор отвечает»."

from config import email_config
from models.rtn_question import RtnQuestion
from schemas.email import RtnQuestionAdminContext
from services.email.dispatcher import EmailDispatcher

TEMPLATE = "rtn_question_admin"
SUBJECT = "Новый вопрос в «Ростехнадзор отвечает» — Ресурс-Плюс"
CTA_URL = "https://plus-resurs.com/admin/rtn/questions"


class SendRtnQuestionAdminEmailUseCase:
    "Уведомление уходит на служебные адреса из ADMIN_NOTIFY_EMAILS, а не пользователю."

    def __init__(self, dispatcher: EmailDispatcher) -> None:
        self.dispatcher = dispatcher

    def execute(self, question: RtnQuestion, author_name: str) -> None:
        context = RtnQuestionAdminContext(
            question_id=question.id,
            question_text=question.question_text,
            contact_email=question.contact_email or "не указан",
            author=author_name,
            created_at=question.created_at.strftime("%d.%m.%Y %H:%M"),
            cta_url=CTA_URL,
        )
        for recipient in email_config.admin_recipients:
            self.dispatcher.dispatch(recipient, TEMPLATE, SUBJECT, context)
