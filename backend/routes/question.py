from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user, get_current_user_optional
from models.account import UserRole
from models.question import OrderQuestion
from schemas.question import (
    QuestionAnswer,
    QuestionAsk,
    QuestionListResponse,
    QuestionResponse,
    QuestionUpdate,
)
from services.email import EmailDispatcher, EmailRepository
from services.email.use_cases.send_question_answered_email import SendQuestionAnsweredEmailUseCase
from services.email.use_cases.send_question_asked_email import SendQuestionAskedEmailUseCase
from services.notifications import NotificationRepository
from services.notifications.use_cases.create_question_notifications import (
    CreateQuestionAnsweredNotificationUseCase,
    CreateQuestionAskedNotificationUseCase,
)
from services.questions import (
    AnswerQuestionUseCase,
    AskQuestionUseCase,
    ListQuestionsUseCase,
    QuestionRepository,
    UpdateQuestionUseCase,
)

router = APIRouter(tags=["questions"])


def build_repo(db: AsyncSession) -> QuestionRepository:
    return QuestionRepository(db)


def to_response(question: OrderQuestion) -> QuestionResponse:
    expert = question.expert
    parts = [expert.first_name or "", expert.last_name or ""] if expert else []
    expert_name = " ".join(p for p in parts if p) if expert else ""
    return QuestionResponse(
        id=question.id,
        order_id=question.order_id,
        expert_id=question.expert_id,
        expert_name=expert_name,
        expert_avatar_url=expert.avatar_url if expert else None,
        question=question.question,
        answer=question.answer,
        asked_at=question.asked_at,
        answered_at=question.answered_at,
        is_anonymous=bool(question.is_anonymous),
    )


async def get_user_role(db: AsyncSession, user_id: int) -> UserRole | None:
    return await build_repo(db).get_user_role(user_id)


@router.get("/orders/{order_id}/questions", response_model=QuestionListResponse)
async def list_order_questions(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int | None = Depends(get_current_user_optional),
) -> QuestionListResponse:
    "Публичный список вопросов: гость и сторонние видят только не-анонимные; владелец и автор — всё."
    role = await get_user_role(db, user_id) if user_id is not None else None
    items = await ListQuestionsUseCase(build_repo(db)).execute(
        order_id=order_id, viewer_id=user_id, viewer_role=role,
    )
    return QuestionListResponse(items=[to_response(q) for q in items], total=len(items))


@router.post("/orders/{order_id}/questions", response_model=QuestionResponse)
async def ask_order_question(
    order_id: int,
    payload: QuestionAsk,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> QuestionResponse:
    "Задаёт вопрос по заказу от лица эксперта, опционально анонимно."
    role = await get_user_role(db, user_id)
    use_case = AskQuestionUseCase(
        repo=build_repo(db),
        in_app_notify=CreateQuestionAskedNotificationUseCase(NotificationRepository(db)),
        send_email=SendQuestionAskedEmailUseCase(
            repo=EmailRepository(db),
            dispatcher=EmailDispatcher(background_tasks),
        ),
    )
    question = await use_case.execute(
        order_id=order_id,
        expert_id=user_id,
        expert_role=role,
        text=payload.question,
        is_anonymous=payload.is_anonymous,
    )
    refreshed = await build_repo(db).get_by_id(question.id)
    return to_response(refreshed)


@router.patch("/questions/{question_id}", response_model=QuestionResponse)
async def update_question(
    question_id: int,
    payload: QuestionUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> QuestionResponse:
    "Редактирует текст или флаг анонимности вопроса; только автор."
    question = await UpdateQuestionUseCase(build_repo(db)).execute(
        question_id=question_id,
        expert_id=user_id,
        text=payload.question,
        is_anonymous=payload.is_anonymous,
    )
    return to_response(question)


@router.patch("/questions/{question_id}/answer", response_model=QuestionResponse)
async def answer_question(
    question_id: int,
    payload: QuestionAnswer,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> QuestionResponse:
    "Ответ владельца заказа на вопрос эксперта."
    use_case = AnswerQuestionUseCase(
        repo=build_repo(db),
        in_app_notify=CreateQuestionAnsweredNotificationUseCase(NotificationRepository(db)),
        send_email=SendQuestionAnsweredEmailUseCase(
            repo=EmailRepository(db),
            dispatcher=EmailDispatcher(background_tasks),
        ),
    )
    question = await use_case.execute(
        question_id=question_id, customer_id=user_id, text=payload.answer,
    )
    return to_response(question)
