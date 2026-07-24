"Use case: форма «Не нашли ответ?» — сохраняет вопрос посетителя в очередь модерации."

from models.rtn_question import RtnQuestion
from services.rtn.repository import RtnQuestionRepository


class SubmitRtnQuestionUseCase:
    def __init__(self, questions: RtnQuestionRepository) -> None:
        self.questions = questions

    async def execute(
        self,
        user_id: int | None,
        visitor_key: str,
        question_text: str,
        contact_email: str,
    ) -> RtnQuestion:
        return await self.questions.add(user_id, visitor_key, contact_email.strip(), question_text.strip())
