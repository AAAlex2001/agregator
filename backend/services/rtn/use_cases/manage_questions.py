"Use cases: обработка вопросов «Не нашли ответ?» модератором — смена статуса и привязка ответа."

from models.rtn_question import RtnQuestion, RtnQuestionStatus
from services.email.use_cases.send_rtn_answer_published_email import SendRtnAnswerPublishedEmailUseCase
from services.rtn.repository import RtnQuestionRepository, RtnQuestionSubscriptionRepository


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
    "Разъяснение создано из вопроса — вопрос закрывается, получает ссылку на ответ, подписчики получают письмо."

    def __init__(
        self,
        questions: RtnQuestionRepository,
        subscriptions: RtnQuestionSubscriptionRepository | None = None,
        notifier: SendRtnAnswerPublishedEmailUseCase | None = None,
    ) -> None:
        self.questions = questions
        self.subscriptions = subscriptions
        self.notifier = notifier

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
        await self.notify_subscribers(question)

    async def notify_subscribers(self, question: RtnQuestion) -> None:
        "Письмо уходит один раз: подписки помечаются notified_at сразу после постановки в очередь."
        if self.subscriptions is None or self.notifier is None:
            return
        answer = await self.questions.get_answer(question)
        if answer is None:
            return
        pending = await self.subscriptions.list_pending(question.id)
        if not pending:
            return
        self.notifier.execute(
            [subscription.email for subscription in pending],
            question.question_text,
            answer[0],
            answer[1],
        )
        await self.subscriptions.mark_notified(pending)
