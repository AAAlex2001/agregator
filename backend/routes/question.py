from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.user import User, UserRole
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


def to_response(question) -> QuestionResponse:
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
    )


async def get_user_role(db: AsyncSession, user_id: int) -> UserRole | None:
    return (await db.execute(select(User.role).where(User.id == user_id))).scalar_one_or_none()


@router.get("/orders/{order_id}/questions", response_model=QuestionListResponse)
async def list_order_questions(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    items = await ListQuestionsUseCase(build_repo(db)).execute(order_id)
    return QuestionListResponse(items=[to_response(q) for q in items], total=len(items))


@router.post("/orders/{order_id}/questions", response_model=QuestionResponse)
async def ask_order_question(
    order_id: int,
    payload: QuestionAsk,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
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
        order_id=order_id, expert_id=user_id, expert_role=role, text=payload.question,
    )
    refreshed = await build_repo(db).get_by_id(question.id)
    return to_response(refreshed)


@router.patch("/questions/{question_id}", response_model=QuestionResponse)
async def update_question(
    question_id: int,
    payload: QuestionUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    question = await UpdateQuestionUseCase(build_repo(db)).execute(
        question_id=question_id, expert_id=user_id, text=payload.question,
    )
    return to_response(question)


@router.patch("/questions/{question_id}/answer", response_model=QuestionResponse)
async def answer_question(
    question_id: int,
    payload: QuestionAnswer,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
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
