from datetime import datetime, timezone

from fastapi import HTTPException, status

from models.question import OrderQuestion
from services.questions.repository import QuestionRepository


class AnswerQuestionUseCase:
    "Заказчик отвечает на вопрос или меняет свой ответ."

    def __init__(self, repo: QuestionRepository):
        self.repo = repo

    async def execute(self, question_id: int, customer_id: int, text: str) -> OrderQuestion:
        question = await self.repo.get_by_id(question_id)
        if question is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вопрос не найден")
        if question.order is None or question.order.customer_id != customer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Отвечать может только заказчик этого заказа",
            )

        question.answer = text
        question.answered_at = datetime.now(timezone.utc)
        await self.repo.flush()
        return question
