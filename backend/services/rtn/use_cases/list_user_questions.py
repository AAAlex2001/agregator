"Use case: список вопросов, отправленных текущим пользователем в Ростехнадзор."

from models.rtn_question import RtnQuestion
from services.rtn.repository import RtnQuestionRepository


class ListUserRtnQuestionsUseCase:
    def __init__(self, questions: RtnQuestionRepository) -> None:
        self.questions = questions

    async def execute(self, user_id: int) -> list[RtnQuestion]:
        return await self.questions.list_by_user(user_id)
