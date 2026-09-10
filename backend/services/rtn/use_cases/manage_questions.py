"Use cases: обработка вопросов «Не нашли ответ?» модератором — смена статуса и привязка ответа."

from models.rtn_question import RtnQuestion, RtnQuestionStatus
from services.rtn.repository import RtnQuestionRepository


class ReasonRequiredError(Exception):
    "Отклонение вопроса без причины: заявитель должен понимать, почему ответа не будет."


class ChangeRtnQuestionStatusUseCase:
    def __init__(self, questions: RtnQuestionRepository) -> None:
        self.questions = questions

    async def execute(
        self,
        question: RtnQuestion,
        status: RtnQuestionStatus,
        dismiss_reason: str,
    ) -> RtnQuestion:
        reason = dismiss_reason.strip()
        if status == RtnQuestionStatus.DISMISSED and not reason:
            raise ReasonRequiredError
        if status != RtnQuestionStatus.DISMISSED:
            reason = ""
        return await self.questions.save_status(question, status, reason)


class AnswerRtnQuestionUseCase:
    "Разъяснение создано из вопроса — вопрос закрывается и получает ссылку на ответ."

    def __init__(self, questions: RtnQuestionRepository) -> None:
        self.questions = questions

    async def execute(self, question_id: int, clarification_id: int) -> None:
        question = await self.questions.get_by_id(question_id)
        if question is None:
            return
        await self.questions.save_status(
            question,
            RtnQuestionStatus.PUBLISHED,
            "",
            clarification_id=clarification_id,
        )
