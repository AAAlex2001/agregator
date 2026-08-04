"Use case: create question notifications."
from models.notification import Notification, NotificationType
from schemas.notification import (
    QuestionAnsweredNotificationPayload,
    QuestionAskedNotificationPayload,
)
from services.notifications.formatters import truncate_preview
from services.notifications.repository import NotificationRepository


class CreateQuestionAskedNotificationUseCase:
    "Заказчику — эксперт задал публичный вопрос по заказу."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        customer_id: int,
        order_title: str,
        expert_name: str,
        question_text: str,
        action_url: str | None = None,
    ) -> Notification:
        "Запускает основной сценарий use case."
        payload = QuestionAskedNotificationPayload(
            order_title=order_title,
            expert_name=expert_name or "Эксперт",
            preview=truncate_preview(question_text),
        )
        notification = Notification(
            user_id=customer_id,
            type=NotificationType.QUESTION_ASKED,
            payload=payload.model_dump(mode="json"),
            action_url=action_url,
        )
        await self.repo.add(notification)
        await self.repo.flush()
        await self.repo.increment_unread(customer_id)
        await self.repo.flush()
        return notification


class CreateQuestionAnsweredNotificationUseCase:
    "Эксперту — заказчик ответил на вопрос."

    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    async def execute(
        self,
        expert_id: int,
        order_title: str,
        answer_text: str,
        action_url: str | None = None,
    ) -> Notification:
        "Запускает основной сценарий use case."
        payload = QuestionAnsweredNotificationPayload(
            order_title=order_title,
            preview=truncate_preview(answer_text),
        )
        notification = Notification(
            user_id=expert_id,
            type=NotificationType.QUESTION_ANSWERED,
            payload=payload.model_dump(mode="json"),
            action_url=action_url,
        )
        await self.repo.add(notification)
        await self.repo.flush()
        await self.repo.increment_unread(expert_id)
        await self.repo.flush()
        return notification
