"Use cases: публичная лента вопросов, ответы сообщества и подписка на официальный ответ."

from typing import Any

from models.rtn_question_reply import RtnQuestionReply
from services.rtn.repository import (
    PublicRtnQuestion,
    RtnQuestionReplyRepository,
    RtnQuestionRepository,
    RtnQuestionSubscriptionRepository,
)

PUBLIC_QUESTIONS_LIMIT = 50


class QuestionNotPublicError(Exception):
    "Вопрос ещё не взят в работу или отклонён — посетителям он не показывается."


class AttachmentRequiredError(Exception):
    "Ответ без документа не принимается: делимся полученным ответом, а не мнением."


class ListPublicRtnQuestionsUseCase:
    def __init__(self, questions: RtnQuestionRepository) -> None:
        self.questions = questions

    async def execute(self) -> list[PublicRtnQuestion]:
        return await self.questions.list_public(PUBLIC_QUESTIONS_LIMIT)


class ListRtnQuestionRepliesUseCase:
    def __init__(self, questions: RtnQuestionRepository, replies: RtnQuestionReplyRepository) -> None:
        self.questions = questions
        self.replies = replies

    async def execute(self, question_id: int) -> list[RtnQuestionReply]:
        question = await self.questions.get_public_by_id(question_id)
        if question is None:
            raise QuestionNotPublicError
        return await self.replies.list_for_question(question_id)


class AddRtnQuestionReplyUseCase:
    def __init__(self, questions: RtnQuestionRepository, replies: RtnQuestionReplyRepository) -> None:
        self.questions = questions
        self.replies = replies

    async def execute(
        self,
        question_id: int,
        user_id: int | None,
        visitor_key: str,
        text: str,
        attachments: list[Any],
    ) -> RtnQuestionReply:
        question = await self.questions.get_public_by_id(question_id)
        if question is None:
            raise QuestionNotPublicError
        if not attachments:
            raise AttachmentRequiredError
        return await self.replies.add(question_id, user_id, visitor_key, text.strip(), attachments)


class SubscribeToRtnQuestionUseCase:
    def __init__(
        self,
        questions: RtnQuestionRepository,
        subscriptions: RtnQuestionSubscriptionRepository,
    ) -> None:
        self.questions = questions
        self.subscriptions = subscriptions

    async def execute(self, question_id: int, user_id: int | None, email: str) -> None:
        question = await self.questions.get_public_by_id(question_id)
        if question is None:
            raise QuestionNotPublicError
        await self.subscriptions.subscribe(question_id, user_id, email.strip().lower())
