"Уведомления при обновлении отклика: email + in-app."
from typing import Any

from models.response import OrderResponse
from schemas.notification import ResponseUpdateKind
from services.email import SendResponseUpdatedEmailUseCase
from services.email.changes import summarize_response_changes
from services.responses.in_app_notifier import ResponseInAppNotifier


class ResponseUpdateNotifier:
    "Координирует отправку email и in-app уведомлений об изменении отклика."

    def __init__(
        self,
        in_app: ResponseInAppNotifier,
        send_updated_email: SendResponseUpdatedEmailUseCase | None = None,
    ) -> None:
        self.in_app = in_app
        self.send_updated_email = send_updated_email

    @staticmethod
    def snapshot(response: OrderResponse) -> dict[str, Any]:
        "Публичный метод сервисного слоя."
        return {
            "sum_amount": response.proposed_sum_amount,
            "deadline": response.proposed_deadline,
            "comment": response.comment or "",
            "files_count": len(response.technical_files or []),
        }

    async def notify(self, updated: OrderResponse, before: dict[str, Any]) -> None:
        "Отправляет уведомление получателю."
        await self.in_app.response_updated(updated, kind=ResponseUpdateKind.UPDATED)
        await self.send_email_if_changed(updated, before)

    async def send_email_if_changed(
        self, updated: OrderResponse, before: dict[str, Any]
    ) -> None:
        "Отправляет уведомление получателю."
        if self.send_updated_email is None:
            return
        summary = summarize_response_changes(
            before["sum_amount"],
            updated.proposed_sum_amount,
            before["deadline"],
            updated.proposed_deadline,
            before["comment"],
            updated.comment or "",
            before["files_count"],
            len(updated.technical_files or []),
        )
        if not summary:
            return
        await self.send_updated_email.execute(updated.id, summary)
