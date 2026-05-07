from fastapi import HTTPException, status

from models.question import OrderQuestion
from services.questions.repository import QuestionRepository


class UpdateQuestionUseCase:
    "Эксперт правит свой вопрос — пока заказчик не ответил."

    def __init__(self, repo: QuestionRepository):
        self.repo = repo

    async def execute(
        self,
        question_id: int,
        expert_id: int,
        text: str,
        is_anonymous: bool | None = None,
    ) -> OrderQuestion:
        question = await self.repo.get_by_id(question_id)
        if question is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вопрос не найден")
        if question.expert_id != expert_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Можно править только свой вопрос",
            )
        if question.answer is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Нельзя править вопрос после ответа заказчика",
            )

        question.question = text
        if is_anonymous is not None:
            question.is_anonymous = is_anonymous
        await self.repo.flush()
        return question
