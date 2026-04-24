from fastapi import HTTPException, status as http_status

from models.response import OrderResponse, ResponseStatus
from models.user import User, UserRole

EXPERT_ALLOWED_TARGETS = {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}
CUSTOMER_ALLOWED_TARGETS = {
    ResponseStatus.REJECTED,
    ResponseStatus.ACCEPTED,
    ResponseStatus.IN_PROGRESS,
    ResponseStatus.COMPLETED,
}
EXPERT_IN_PROGRESS_FROM = {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS}
EXPERT_COMPLETED_FROM = {ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}
CUSTOMER_IN_PROGRESS_FROM = {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS}
CUSTOMER_ACCEPTED_FROM = {ResponseStatus.REVIEW, ResponseStatus.IN_PROGRESS}
CUSTOMER_COMPLETED_FROM = {
    ResponseStatus.ACCEPTED,
    ResponseStatus.IN_PROGRESS,
    ResponseStatus.COMPLETED,
}


class ResponseStatusRules:
    "Валидация переходов статуса отклика. Без IO, чистые проверки."

    def check(
        self,
        actor: User,
        response: OrderResponse,
        new_status: ResponseStatus,
    ) -> None:
        if actor.role == UserRole.EXPERT:
            self.check_expert(actor, response, new_status)
            return
        if actor.role == UserRole.CUSTOMER:
            self.check_customer(actor, response, new_status)
            return
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для изменения статуса",
        )

    def check_expert(
        self,
        actor: User,
        response: OrderResponse,
        new_status: ResponseStatus,
    ) -> None:
        if response.expert_id != actor.id:
            raise self.forbidden("Нельзя изменять чужой отклик")
        if new_status not in EXPERT_ALLOWED_TARGETS:
            raise self.forbidden("Эксперт может только начать или завершить проект")
        if new_status == ResponseStatus.IN_PROGRESS:
            self.check_expert_in_progress(actor, response)
        if new_status == ResponseStatus.COMPLETED:
            self.check_expert_completed(actor, response)

    def check_expert_in_progress(self, actor: User, response: OrderResponse) -> None:
        if response.status not in EXPERT_IN_PROGRESS_FROM:
            raise self.conflict("В работу можно перевести только принятый отклик")
        if not response.order or response.order.assigned_expert_id != actor.id:
            raise self.conflict("Нельзя начать работу по незакрепленному заказу")

    def check_expert_completed(self, actor: User, response: OrderResponse) -> None:
        if response.status not in EXPERT_COMPLETED_FROM:
            raise self.conflict("Завершить можно только отклик со статусом в работе")
        if not response.order or response.order.assigned_expert_id != actor.id:
            raise self.conflict("Нельзя завершить незакрепленный заказ")

    def check_customer(
        self,
        actor: User,
        response: OrderResponse,
        new_status: ResponseStatus,
    ) -> None:
        if not response.order or response.order.customer_id != actor.id:
            raise self.forbidden("Нельзя изменять отклик к чужому заказу")
        if new_status not in CUSTOMER_ALLOWED_TARGETS:
            raise self.forbidden(
                "Заказчик может только отклонять, принимать, переводить отклик в переговоры или завершать проект"
            )
        if new_status == ResponseStatus.IN_PROGRESS:
            self.check_customer_in_progress(response)
        if new_status == ResponseStatus.ACCEPTED:
            self.check_customer_accepted(response)
        if new_status == ResponseStatus.COMPLETED:
            self.check_customer_completed(response)

    def check_customer_in_progress(self, response: OrderResponse) -> None:
        if response.status not in CUSTOMER_IN_PROGRESS_FROM:
            raise self.conflict(
                "В переговоры можно перевести только отклик после приглашения в чат"
            )

    def check_customer_accepted(self, response: OrderResponse) -> None:
        if response.status not in CUSTOMER_ACCEPTED_FROM:
            raise self.conflict(
                "Выбрать исполнителем можно только отклик на рассмотрении или в переговорах"
            )

    def check_customer_completed(self, response: OrderResponse) -> None:
        if response.status not in CUSTOMER_COMPLETED_FROM:
            raise self.conflict(
                "Завершить можно только отклик со статусом исполнитель выбран или в переговорах"
            )
        order = response.order
        if order is None or order.assigned_expert_id != response.expert_id:
            raise self.conflict(
                "Нельзя завершить проект для незакрепленного исполнителя"
            )

    @staticmethod
    def forbidden(detail: str) -> HTTPException:
        return HTTPException(status_code=http_status.HTTP_403_FORBIDDEN, detail=detail)

    @staticmethod
    def conflict(detail: str) -> HTTPException:
        return HTTPException(status_code=http_status.HTTP_409_CONFLICT, detail=detail)
