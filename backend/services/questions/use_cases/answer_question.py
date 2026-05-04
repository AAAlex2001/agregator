from datetime import datetime, timezone

from fastapi import HTTPException, status

from models.question import OrderQuestion
from services.email.use_cases.send_question_answered_email import SendQuestionAnsweredEmailUseCase
from services.notifications.use_cases.create_question_notifications import (
    CreateQuestionAnsweredNotificationUseCase,
)
from services.questions.repository import QuestionRepository

EXPERT_QUESTION_URL = "/expert/orders"


class AnswerQuestionUseCase:
    "Заказчик отвечает на вопрос или меняет свой ответ."

    def __init__(
        self,
        repo: QuestionRepository,
        in_app_notify: CreateQuestionAnsweredNotificationUseCase | None = None,
        send_email: SendQuestionAnsweredEmailUseCase | None = None,
    ):
        self.repo = repo
        self.in_app_notify = in_app_notify
        self.send_email = send_email

    async def execute(self, question_id: int, customer_id: int, text: str) -> OrderQuestion:
        question = await self.repo.get_by_id(question_id)
        if question is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вопрос не найден")
        if question.order is None or question.order.customer_id != customer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Отвечать может только заказчик этого заказа",
            )

        is_first_answer = question.answer is None
        question.answer = text
        question.answered_at = datetime.now(timezone.utc)
        await self.repo.flush()

        if is_first_answer:
            if self.in_app_notify is not None:
                await self.in_app_notify.execute(
                    expert_id=question.expert_id,
                    order_title=question.order.title or "",
                    answer_text=text,
                    action_url=EXPERT_QUESTION_URL,
                )
            if self.send_email is not None:
                await self.send_email.execute(question.id)

        return question
