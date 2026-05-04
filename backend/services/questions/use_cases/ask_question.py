from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from models.order import OrderStatus
from models.question import OrderQuestion
from models.user import UserRole
from services.questions.repository import QuestionRepository


class AskQuestionUseCase:
    "Эксперт задаёт публичный вопрос по заказу. До отклика, один на заказ."

    def __init__(self, repo: QuestionRepository):
        self.repo = repo

    async def execute(self, order_id: int, expert_id: int, expert_role: UserRole, text: str) -> OrderQuestion:
        if expert_role != UserRole.EXPERT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Задавать вопрос может только эксперт",
            )

        order = await self.repo.get_order(order_id)
        if order is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")
        if order.status != OrderStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Задавать вопросы можно только по активному заказу",
            )

        if await self.repo.expert_has_response(order_id, expert_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Нельзя задать вопрос после отправки отклика",
            )

        question = OrderQuestion(
            order_id=order_id,
            expert_id=expert_id,
            question=text,
            asked_at=datetime.now(timezone.utc),
        )
        await self.repo.add(question)
        try:
            await self.repo.flush()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Вы уже задали вопрос по этому заказу",
            )
        return question
