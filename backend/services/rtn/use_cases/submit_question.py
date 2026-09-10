"Use case: форма «Не нашли ответ?» — сохраняет вопрос посетителя в очередь модерации."

from models.rtn_question import RtnQuestion
from services.email.use_cases.send_rtn_question_admin_email import SendRtnQuestionAdminEmailUseCase
from services.rtn.repository import RtnQuestionRepository


class SubmitRtnQuestionUseCase:
    def __init__(
        self,
        questions: RtnQuestionRepository,
        notifier: SendRtnQuestionAdminEmailUseCase | None = None,
    ) -> None:
        self.questions = questions
        self.notifier = notifier

    async def execute(
        self,
        user_id: int | None,
        visitor_key: str,
        question_text: str,
        contact_email: str,
    ) -> RtnQuestion:
        question = await self.questions.add(
            user_id, visitor_key, contact_email.strip(), question_text.strip()
        )
        if self.notifier is not None:
            self.notifier.execute(question, "Зарегистрированный пользователь" if user_id else "Гость")
        return question
