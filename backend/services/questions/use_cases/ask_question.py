from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from models.order import OrderStatus
from models.question import OrderQuestion
from models.user import UserRole
from services.email.use_cases.send_question_asked_email import SendQuestionAskedEmailUseCase
from services.notifications.use_cases.create_question_notifications import (
    CreateQuestionAskedNotificationUseCase,
)
from services.questions.repository import QuestionRepository

CUSTOMER_QUESTION_URL = "/customer/orders"


class AskQuestionUseCase:
    "Эксперт задаёт публичный вопрос по заказу. До отклика, один на заказ."

    def __init__(
        self,
        repo: QuestionRepository,
        in_app_notify: CreateQuestionAskedNotificationUseCase | None = None,
        send_email: SendQuestionAskedEmailUseCase | None = None,
    ):
        self.repo = repo
        self.in_app_notify = in_app_notify
        self.send_email = send_email

    async def execute(
        self,
        order_id: int,
        expert_id: int,
        expert_role: UserRole,
        text: str,
        is_anonymous: bool = True,
    ) -> OrderQuestion:
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
            is_anonymous=is_anonymous,
        )
        await self.repo.add(question)
        try:
            await self.repo.flush()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Вы уже задали вопрос по этому заказу",
            )

        if self.in_app_notify is not None:
            full = await self.repo.get_by_id(question.id)
            expert = full.expert if full else None
            expert_name = (
                " ".join(p for p in [expert.first_name or "", expert.last_name or ""] if p)
                if expert else ""
            )
            await self.in_app_notify.execute(
                customer_id=order.customer_id,
                order_title=order.title or "",
                expert_name=expert_name,
                question_text=text,
                action_url=CUSTOMER_QUESTION_URL,
            )
        if self.send_email is not None:
            await self.send_email.execute(question.id)

        return question
